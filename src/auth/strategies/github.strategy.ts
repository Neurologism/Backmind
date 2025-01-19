// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, Profile } from 'passport-github2';
// import { AuthService } from '../auth.service';
//
// @Injectable()
// export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
//   constructor(private readonly authService: AuthService) {
//     super({
//       clientID: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: process.env.GITHUB_CALLBACK_URL,
//       scope: ['user:email'],
//       passReqToCallback: true
//     });
//   }
//
//   async validate(accessToken: string, refreshToken: string, profile: Profile) {
//     const { id, username, emails } = profile;
//     if (!emails || emails.length === 0) {
//       return null;
//     }
//     if (!username) {
//       return null;
//     }
//     const email = emails[0].value;
//     return await this.authService.successfulAuth(email, username);
//   }
// }
