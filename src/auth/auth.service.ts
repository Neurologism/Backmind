import { UserModel } from '../../mongooseSchemas/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '../../utility/sendVerificationEmail';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(user: any, pass: string) {
    if (user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async validateUserByEmail(email: string, pass: string): Promise<any> {
    const user = await UserModel.findOne({
      emails: { $elemMatch: { address: email } },
    });
    await this.validateUser(user, pass);
    return user;
  }

  async validateUserByBrainetTag(
    brainetTag: string,
    pass: string
  ): Promise<any> {
    const user = await UserModel.findOne({ brainetTag: brainetTag });
    await this.validateUser(user, pass);
    return user;
  }

  async login(user: any) {
    const access_token = this.jwtService.sign(
      { _id: '' + user._id },
      {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_TOKEN_EXPIRE_IN,
      }
    );
    user.tokens.push({ token: access_token });
    const maxTokens = process.env.MAX_TOKENS
      ? parseInt(process.env.MAX_TOKENS)
      : 10;
    if (user.tokens.length > maxTokens) {
      user.tokens.shift();
    }
    await user.save();
    return {
      access_token: access_token,
    };
  }

  async register(body: any, logger: any) {
    const user = await UserModel.findOne({
      $or: [
        { 'emails.address': body.user.email },
        { brainetTag: body.user.brainetTag },
      ],
    });
    if (user !== null) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    if (Boolean(process.env.DISABLE_ACCOUNT_CREATION as string)) {
      throw new HttpException(
        'Account creation is disabled.',
        HttpStatus.FORBIDDEN
      );
    }

    if (!body.agreedToTermsOfServiceAndPrivacyPolicy) {
      throw new HttpException(
        'You need to agree to the terms of service and privacy policy.',
        HttpStatus.BAD_REQUEST
      );
    }

    const brainetTagRegex = /^[a-zA-Z0-9_-]{1,32}$/;
    if (!brainetTagRegex.test(body.user.brainetTag)) {
      throw new HttpException(
        'brainetTag must consist of letters, numbers, underscores, hyphens and have a length between 1 and 32 characters.',
        HttpStatus.BAD_REQUEST
      );
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(body.user.plainPassword, salt);

    let verifyEmailReturn = await sendVerificationEmail(
      body.user.email,
      logger
    );

    const newUser = new UserModel({
      emails: [
        {
          emailType: 'primary',
          verified: Boolean(process.env.VERIFY_ALL_EMAILS),
          address: body.user.email,
          verificationToken: verifyEmailReturn.mailVerificationToken,
          dateVerificationSent: new Date(),
        },
      ],
      brainetTag: body.user.brainetTag,
      displayname: body.user.brainetTag,
      passwordHash: hashedPassword,
    });
    const savedUser = await newUser.save();

    return await this.login(savedUser);
  }

  async verifyEmail(token: string) {
    const user = await UserModel.findOne({
      emails: {
        $elemMatch: { verificationToken: token },
      },
    });

    if (user === null) {
      throw new HttpException(
        'Invalid verification token',
        HttpStatus.BAD_REQUEST
      );
    }

    const email = user.emails.find(
      (email) => email.verificationToken === token
    );

    if (email === undefined) {
      throw new HttpException(
        'Invalid verification token',
        HttpStatus.BAD_REQUEST
      );
    }

    if (email.verified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    if (email.dateVerificationSent === undefined) {
      throw new HttpException(
        'Invalid verification token',
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      (new Date().getTime() - email.dateVerificationSent.getTime()) / 60000 >=
      Number(process.env.EMAIL_VERIFICATION_TOKEN_VALID_MINUTES)
    ) {
      throw new HttpException(
        'Invalid verification token',
        HttpStatus.BAD_REQUEST
      );
    }

    email.verified = true;
    email.dateVerified = new Date();

    await user.save();

    return await this.login(user);
  }

  async logout(user: any, token: string) {
    user.tokens = user.tokens.filter((t: any) => t.token !== token);
    await user.save();
    return { msg: 'Logged out successfully' };
  }

  async logoutAll(user: any) {
    user.tokens = [];
    await user.save();
    return { msg: 'Logged out from all devices successfully' };
  }
}
