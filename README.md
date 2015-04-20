# fis-helper

一切便于开发的新特性，都将以 helper 的形式提供，这些 helper 不一定是完全符合 FIS 设计理念的，但是确实很有用；

## API

### config

```js
var helper = require('fis-helper');
helper.hacker('config');
```

#### fis.plugin

以后 merge 或者 append 都可以使用 `fis.plugin` 设置插件了，例子如下

```js
fis.config.append('modules.postprocessor.js', fis.plugin('jswrapper', {
    type: 'amd'
}));
```

#### fis.config.merge

- `roadmap.path` 将以用户的优先，而不是执行纯粹的 `merge`
- `modules` 插件不再是覆盖，而是 Append

#### fis.config.append

给插件点 Append 一个插件，而不是覆盖已经设置的插件。

```js
fis.config.append('modules.postprocessor.js', function (content, file, settings) {
    console.log('balabalabala....');
    return content;
});
```

#### fis.config.disable

禁止一个插件，将其从插件扩展点移除；

```js
fis.config.disable('modules.postprocessor.js', 'jswrapper');
```
