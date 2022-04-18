/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite';
import path from 'path';
import {
  viteThemePlugin,
  antdDarkThemePlugin,
  mixLighten,
  mixDarken,
  tinycolor,
} from 'vite-plugin-theme';
import { getThemeColors, generateColors } from '../../config/themeConfig';
import { generateModifyVars } from '../../generate/generateModifyVars';

export function configThemePlugin(isBuild: boolean): Plugin[] {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
  });

  // 抽取出viteThemePlugin插件，下方会根据不同环境设置enforce
  const vite_theme_plugin = viteThemePlugin({
    resolveSelector: (s) => {
      s = s.trim();
      switch (s) {
        case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
          return '.ant-steps-item-icon > .ant-steps-icon';
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
          return s;
        case '.ant-steps-item-icon > .ant-steps-icon':
          return s;
        case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
          return s;
        default:
          if (s.indexOf('.ant-btn') >= -1) {
            // 按钮被重新定制过，需要过滤掉class防止覆盖
            return s;
          }
      }
      return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`;
    },
    colorVariables: [...getThemeColors(), ...colors],
  });
  //console.log('vite_theme_plugin:'+JSON.stringify(vite_theme_plugin));
  vite_theme_plugin.forEach(function (item) {
    //对vite:theme插件特殊配置
    if ('vite:theme' === item.name) {
      //console.log(item);
      // 打包时去除enforce: "post"，vite 2.6.x适配，否则生成app-theme-style为空，因为async transform(code, id) {的code没有正确获取
      if (isBuild) {
        delete item.enforce;
      }
      //console.log(item);
    }
  });

  const plugin = [
    vite_theme_plugin,
    // viteThemePlugin({
    //   resolveSelector: (s) => {
    //     s = s.trim();
    //     switch (s) {
    //       case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
    //         return '.ant-steps-item-icon > .ant-steps-icon';
    //       case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
    //       case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
    //       case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
    //         return s;
    //       case '.ant-steps-item-icon > .ant-steps-icon':
    //         return s;
    //       case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
    //         return s;
    //       default:
    //         if (s.indexOf('.ant-btn') >= -1) {
    //           // 按钮被重新定制过，需要过滤掉class防止覆盖
    //           return s;
    //         }
    //     }
    //     return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`;
    //   },
    //   colorVariables: [...getThemeColors(), ...colors],
    // }),
    antdDarkThemePlugin({
      preloadFiles: [
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        //path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.dark.less'),
        path.resolve(process.cwd(), 'src/design/index.less'),
      ],
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // extractCss: false,
      darkModifyVars: {
        ...generateModifyVars(true),
        'text-color': '#90A2C9', //  文本颜色
        // 'primary-1': 'rgb(255 255 255 / 8%)',
        'primary-1': '#f40', // 关闭按钮的颜色
        'text-color-base': '#c9d1d9',
        'component-background': '#2C3B5B', // 组件背景颜色
        'heading-color': 'rgb(255 255 255 / 65%)', // 表格头部字体颜色
        'table-header-bg': '#24324F', // 表格头部背景色
        black: '#16223C', //  底部背景色
        'text-color-secondary': '#8b949e',
        'border-color-base': '#3D4A65', // 边框颜色
        'border-color-split': '#3D4A65', // 分割线颜色
        'item-active-bg': '#111b26',
        'app-content-background': '#24324F', // 表格斑马线第二个颜色
        'tree-node-selected-bg': '#11263c',
        'popover-background': '#2C3B5B', // 弹框、drawer头部背景颜色
        'table-row-hover-bg': '#202C45', // 表格行鼠标悬浮背景色
        // 'divider-color': '#f40', // 分割线颜色 好像没用

        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#fff',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24',
      },
    }),
  ];

  return plugin as unknown as Plugin[];
}
