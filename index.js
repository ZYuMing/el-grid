import Grid from './src/main';

/* istanbul ignore next */
Grid.install = function(Vue) {
  Vue.component(Grid.name, Grid);
};

export default Grid;
