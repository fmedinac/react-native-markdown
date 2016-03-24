var React = require('react-native');
var {
  View
} = React;
var _ = require('lodash');
var SimpleMarkdown = require('simple-markdown');

var Markdown = React.createClass({

  getDefaultProps: function() {
    return {
      style: []
    };
  },

  componentWillMount: function() {
    if (this.props.enableLightBox && !this.props.navigator) {
      throw new Error('props.navigator must be specified when enabling lightbox')
    }
    var opts = {
      enableLightBox: this.props.enableLightBox,
      navigator: this.props.navigator,
      imageParam: this.props.imageParam,
    }

    var rules = require('./rules')(this.props.style, opts);
    rules = _.merge({}, SimpleMarkdown.defaultRules, rules);

    var parser = SimpleMarkdown.parserFor(rules);
    this.parse = function(source) {
      var blockSource = source + '\n\n';
      return parser(blockSource, {inline: false});
    };
    this.renderer = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'));
  },


  componentDidMount: function() {
    if (this.props.onLoad) {
      this.props.onLoad()
    }
  },

  render: function() {

    var child = _.isArray(this.props.children)
      ? this.props.children.join('') : this.props.children;
    var tree = this.parse(child);
    return <View style={this.props.style.view}>{this.renderer(tree)}</View>;
  }
});

module.exports = Markdown;
