import {
  __commonJS
} from "./chunk-S5KM4IGW.js";

// node_modules/handlebars-helper-range/index.js
var require_handlebars_helper_range = __commonJS({
  "node_modules/handlebars-helper-range/index.js"(exports, module) {
    "use strict";
    function range(start, end, step) {
      start = Number(start) || 0;
      end = end == null ? end : Number(end);
      step = step == null ? 1 : Number(step);
      if (end == null) {
        end = start;
        start = 0;
      }
      var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
      var result = new Array(length);
      for (var i = 0; i < length; i += 1) {
        result[i] = start;
        start += step;
      }
      return result;
    }
    module.exports = function() {
      var args = Array.prototype.slice.call(arguments), rangeArgs = args.slice(0, -1), options = args[args.length - 1];
      return range.apply(null, rangeArgs).map(function(num) {
        return options.fn(num);
      }).join("");
    };
  }
});

// dep:handlebars-helper-range
var handlebars_helper_range_default = require_handlebars_helper_range();
export {
  handlebars_helper_range_default as default
};
//# sourceMappingURL=handlebars-helper-range.js.map
