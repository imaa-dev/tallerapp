const React = require('react');
const { View } = require('react-native');

const createIcon = (name) => {
  const Icon = (props) => React.createElement(View, { testID: `icon-${name}`, ...props });
  Icon.displayName = name;
  return Icon;
};

module.exports = new Proxy({}, {
  get(target, prop) {
    if (prop === '__esModule') return false;
    if (target[prop]) return target[prop];
    target[prop] = createIcon(prop);
    return target[prop];
  },
});
