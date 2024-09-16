export const stripComponents = (components: any) => {
  components.add.modules.map((module: any) => {
    delete module.position;
  });
};
