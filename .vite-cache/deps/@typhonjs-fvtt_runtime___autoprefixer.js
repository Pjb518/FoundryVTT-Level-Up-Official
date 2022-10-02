import {
  require_background_clip_text,
  require_background_img_opts,
  require_border_image,
  require_border_radius,
  require_browserslist,
  require_calc,
  require_css3_boxsizing,
  require_css3_cursors_grab,
  require_css3_cursors_newer,
  require_css3_tabsize,
  require_css_animation,
  require_css_any_link,
  require_css_appearance,
  require_css_autofill,
  require_css_backdrop_filter,
  require_css_boxdecorationbreak,
  require_css_boxshadow,
  require_css_clip_path,
  require_css_crisp_edges,
  require_css_cross_fade,
  require_css_deviceadaptation,
  require_css_element_function,
  require_css_featurequeries,
  require_css_file_selector_button,
  require_css_filter_function,
  require_css_filters,
  require_css_gradients,
  require_css_grid,
  require_css_hyphens,
  require_css_image_set,
  require_css_logical_props,
  require_css_masks,
  require_css_media_resolution,
  require_css_overscroll_behavior,
  require_css_placeholder,
  require_css_placeholder_shown,
  require_css_print_color_adjust,
  require_css_read_only_write,
  require_css_regions,
  require_css_selection,
  require_css_shapes,
  require_css_snappoints,
  require_css_sticky,
  require_css_text_align_last,
  require_css_text_orientation,
  require_css_text_spacing,
  require_css_transitions,
  require_css_unicode_bidi,
  require_css_width_stretch,
  require_css_writing_mode,
  require_flexbox,
  require_font_feature,
  require_font_kerning,
  require_fullscreen,
  require_intrinsic_width,
  require_lib,
  require_multicolumn,
  require_object_fit,
  require_picocolors_browser,
  require_pointer,
  require_postcss,
  require_text_decoration,
  require_text_emphasis,
  require_text_overflow,
  require_text_size_adjust,
  require_transforms2d,
  require_transforms3d,
  require_unpacker,
  require_user_select_none
} from "./chunk-3GZT463K.js";
import "./chunk-KRUPHXZG.js";
import {
  __commonJS
} from "./chunk-S5KM4IGW.js";

// node_modules/autoprefixer/lib/utils.js
var require_utils = __commonJS({
  "node_modules/autoprefixer/lib/utils.js"(exports, module) {
    var { list } = require_postcss();
    module.exports.error = function(text) {
      let err = new Error(text);
      err.autoprefixer = true;
      throw err;
    };
    module.exports.uniq = function(array) {
      return [...new Set(array)];
    };
    module.exports.removeNote = function(string) {
      if (!string.includes(" ")) {
        return string;
      }
      return string.split(" ")[0];
    };
    module.exports.escapeRegexp = function(string) {
      return string.replace(/[$()*+-.?[\\\]^{|}]/g, "\\$&");
    };
    module.exports.regexp = function(word, escape = true) {
      if (escape) {
        word = this.escapeRegexp(word);
      }
      return new RegExp(`(^|[\\s,(])(${word}($|[\\s(,]))`, "gi");
    };
    module.exports.editList = function(value, callback) {
      let origin = list.comma(value);
      let changed = callback(origin, []);
      if (origin === changed) {
        return value;
      }
      let join = value.match(/,\s*/);
      join = join ? join[0] : ", ";
      return changed.join(join);
    };
    module.exports.splitSelector = function(selector) {
      return list.comma(selector).map((i) => {
        return list.space(i).map((k) => {
          return k.split(/(?=\.|#)/g);
        });
      });
    };
    module.exports.isPureNumber = function(value) {
      if (typeof value === "number") {
        return true;
      }
      if (typeof value === "string") {
        return /^[0-9]+$/.test(value);
      }
      return false;
    };
  }
});

// node_modules/autoprefixer/lib/browsers.js
var require_browsers = __commonJS({
  "node_modules/autoprefixer/lib/browsers.js"(exports, module) {
    var browserslist = require_browserslist();
    var agents = require_unpacker().agents;
    var utils = require_utils();
    var Browsers = class {
      static prefixes() {
        if (this.prefixesCache) {
          return this.prefixesCache;
        }
        this.prefixesCache = [];
        for (let name in agents) {
          this.prefixesCache.push(`-${agents[name].prefix}-`);
        }
        this.prefixesCache = utils.uniq(this.prefixesCache).sort((a, b) => b.length - a.length);
        return this.prefixesCache;
      }
      static withPrefix(value) {
        if (!this.prefixesRegexp) {
          this.prefixesRegexp = new RegExp(this.prefixes().join("|"));
        }
        return this.prefixesRegexp.test(value);
      }
      constructor(data, requirements, options, browserslistOpts) {
        this.data = data;
        this.options = options || {};
        this.browserslistOpts = browserslistOpts || {};
        this.selected = this.parse(requirements);
      }
      parse(requirements) {
        let opts = {};
        for (let i in this.browserslistOpts) {
          opts[i] = this.browserslistOpts[i];
        }
        opts.path = this.options.from;
        return browserslist(requirements, opts);
      }
      prefix(browser) {
        let [name, version] = browser.split(" ");
        let data = this.data[name];
        let prefix = data.prefix_exceptions && data.prefix_exceptions[version];
        if (!prefix) {
          prefix = data.prefix;
        }
        return `-${prefix}-`;
      }
      isSelected(browser) {
        return this.selected.includes(browser);
      }
    };
    module.exports = Browsers;
  }
});

// node_modules/autoprefixer/lib/vendor.js
var require_vendor = __commonJS({
  "node_modules/autoprefixer/lib/vendor.js"(exports, module) {
    module.exports = {
      prefix(prop) {
        let match = prop.match(/^(-\w+-)/);
        if (match) {
          return match[0];
        }
        return "";
      },
      unprefixed(prop) {
        return prop.replace(/^-\w+-/, "");
      }
    };
  }
});

// node_modules/autoprefixer/lib/prefixer.js
var require_prefixer = __commonJS({
  "node_modules/autoprefixer/lib/prefixer.js"(exports, module) {
    var Browsers = require_browsers();
    var vendor = require_vendor();
    var utils = require_utils();
    function clone(obj, parent) {
      let cloned = new obj.constructor();
      for (let i of Object.keys(obj || {})) {
        let value = obj[i];
        if (i === "parent" && typeof value === "object") {
          if (parent) {
            cloned[i] = parent;
          }
        } else if (i === "source" || i === null) {
          cloned[i] = value;
        } else if (Array.isArray(value)) {
          cloned[i] = value.map((x) => clone(x, cloned));
        } else if (i !== "_autoprefixerPrefix" && i !== "_autoprefixerValues" && i !== "proxyCache") {
          if (typeof value === "object" && value !== null) {
            value = clone(value, cloned);
          }
          cloned[i] = value;
        }
      }
      return cloned;
    }
    var Prefixer = class {
      static hack(klass) {
        if (!this.hacks) {
          this.hacks = {};
        }
        return klass.names.map((name) => {
          this.hacks[name] = klass;
          return this.hacks[name];
        });
      }
      static load(name, prefixes, all) {
        let Klass = this.hacks && this.hacks[name];
        if (Klass) {
          return new Klass(name, prefixes, all);
        } else {
          return new this(name, prefixes, all);
        }
      }
      static clone(node, overrides) {
        let cloned = clone(node);
        for (let name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }
      constructor(name, prefixes, all) {
        this.prefixes = prefixes;
        this.name = name;
        this.all = all;
      }
      parentPrefix(node) {
        let prefix;
        if (typeof node._autoprefixerPrefix !== "undefined") {
          prefix = node._autoprefixerPrefix;
        } else if (node.type === "decl" && node.prop[0] === "-") {
          prefix = vendor.prefix(node.prop);
        } else if (node.type === "root") {
          prefix = false;
        } else if (node.type === "rule" && node.selector.includes(":-") && /:(-\w+-)/.test(node.selector)) {
          prefix = node.selector.match(/:(-\w+-)/)[1];
        } else if (node.type === "atrule" && node.name[0] === "-") {
          prefix = vendor.prefix(node.name);
        } else {
          prefix = this.parentPrefix(node.parent);
        }
        if (!Browsers.prefixes().includes(prefix)) {
          prefix = false;
        }
        node._autoprefixerPrefix = prefix;
        return node._autoprefixerPrefix;
      }
      process(node, result) {
        if (!this.check(node)) {
          return void 0;
        }
        let parent = this.parentPrefix(node);
        let prefixes = this.prefixes.filter(
          (prefix) => !parent || parent === utils.removeNote(prefix)
        );
        let added = [];
        for (let prefix of prefixes) {
          if (this.add(node, prefix, added.concat([prefix]), result)) {
            added.push(prefix);
          }
        }
        return added;
      }
      clone(node, overrides) {
        return Prefixer.clone(node, overrides);
      }
    };
    module.exports = Prefixer;
  }
});

// node_modules/autoprefixer/lib/declaration.js
var require_declaration = __commonJS({
  "node_modules/autoprefixer/lib/declaration.js"(exports, module) {
    var Prefixer = require_prefixer();
    var Browsers = require_browsers();
    var utils = require_utils();
    var Declaration = class extends Prefixer {
      check() {
        return true;
      }
      prefixed(prop, prefix) {
        return prefix + prop;
      }
      normalize(prop) {
        return prop;
      }
      otherPrefixes(value, prefix) {
        for (let other of Browsers.prefixes()) {
          if (other === prefix) {
            continue;
          }
          if (value.includes(other)) {
            return true;
          }
        }
        return false;
      }
      set(decl, prefix) {
        decl.prop = this.prefixed(decl.prop, prefix);
        return decl;
      }
      needCascade(decl) {
        if (!decl._autoprefixerCascade) {
          decl._autoprefixerCascade = this.all.options.cascade !== false && decl.raw("before").includes("\n");
        }
        return decl._autoprefixerCascade;
      }
      maxPrefixed(prefixes, decl) {
        if (decl._autoprefixerMax) {
          return decl._autoprefixerMax;
        }
        let max = 0;
        for (let prefix of prefixes) {
          prefix = utils.removeNote(prefix);
          if (prefix.length > max) {
            max = prefix.length;
          }
        }
        decl._autoprefixerMax = max;
        return decl._autoprefixerMax;
      }
      calcBefore(prefixes, decl, prefix = "") {
        let max = this.maxPrefixed(prefixes, decl);
        let diff = max - utils.removeNote(prefix).length;
        let before = decl.raw("before");
        if (diff > 0) {
          before += Array(diff).fill(" ").join("");
        }
        return before;
      }
      restoreBefore(decl) {
        let lines = decl.raw("before").split("\n");
        let min = lines[lines.length - 1];
        this.all.group(decl).up((prefixed) => {
          let array = prefixed.raw("before").split("\n");
          let last = array[array.length - 1];
          if (last.length < min.length) {
            min = last;
          }
        });
        lines[lines.length - 1] = min;
        decl.raws.before = lines.join("\n");
      }
      insert(decl, prefix, prefixes) {
        let cloned = this.set(this.clone(decl), prefix);
        if (!cloned)
          return void 0;
        let already = decl.parent.some(
          (i) => i.prop === cloned.prop && i.value === cloned.value
        );
        if (already) {
          return void 0;
        }
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        return decl.parent.insertBefore(decl, cloned);
      }
      isAlready(decl, prefixed) {
        let already = this.all.group(decl).up((i) => i.prop === prefixed);
        if (!already) {
          already = this.all.group(decl).down((i) => i.prop === prefixed);
        }
        return already;
      }
      add(decl, prefix, prefixes, result) {
        let prefixed = this.prefixed(decl.prop, prefix);
        if (this.isAlready(decl, prefixed) || this.otherPrefixes(decl.value, prefix)) {
          return void 0;
        }
        return this.insert(decl, prefix, prefixes, result);
      }
      process(decl, result) {
        if (!this.needCascade(decl)) {
          super.process(decl, result);
          return;
        }
        let prefixes = super.process(decl, result);
        if (!prefixes || !prefixes.length) {
          return;
        }
        this.restoreBefore(decl);
        decl.raws.before = this.calcBefore(prefixes, decl);
      }
      old(prop, prefix) {
        return [this.prefixed(prop, prefix)];
      }
    };
    module.exports = Declaration;
  }
});

// node_modules/fraction.js/fraction.js
var require_fraction = __commonJS({
  "node_modules/fraction.js/fraction.js"(exports, module) {
    (function(root) {
      "use strict";
      var MAX_CYCLE_LEN = 2e3;
      var P = {
        "s": 1,
        "n": 0,
        "d": 1
      };
      function assign(n, s) {
        if (isNaN(n = parseInt(n, 10))) {
          throw Fraction["InvalidParameter"];
        }
        return n * s;
      }
      function newFraction(n, d) {
        if (d === 0) {
          throw Fraction["DivisionByZero"];
        }
        var f = Object.create(Fraction.prototype);
        f["s"] = n < 0 ? -1 : 1;
        n = n < 0 ? -n : n;
        var a = gcd(n, d);
        f["n"] = n / a;
        f["d"] = d / a;
        return f;
      }
      function factorize(num) {
        var factors = {};
        var n = num;
        var i = 2;
        var s = 4;
        while (s <= n) {
          while (n % i === 0) {
            n /= i;
            factors[i] = (factors[i] || 0) + 1;
          }
          s += 1 + 2 * i++;
        }
        if (n !== num) {
          if (n > 1)
            factors[n] = (factors[n] || 0) + 1;
        } else {
          factors[num] = (factors[num] || 0) + 1;
        }
        return factors;
      }
      var parse = function(p1, p2) {
        var n = 0, d = 1, s = 1;
        var v = 0, w = 0, x = 0, y = 1, z = 1;
        var A = 0, B = 1;
        var C = 1, D = 1;
        var N = 1e7;
        var M;
        if (p1 === void 0 || p1 === null) {
        } else if (p2 !== void 0) {
          n = p1;
          d = p2;
          s = n * d;
          if (n % 1 !== 0 || d % 1 !== 0) {
            throw Fraction["NonIntegerParameter"];
          }
        } else
          switch (typeof p1) {
            case "object": {
              if ("d" in p1 && "n" in p1) {
                n = p1["n"];
                d = p1["d"];
                if ("s" in p1)
                  n *= p1["s"];
              } else if (0 in p1) {
                n = p1[0];
                if (1 in p1)
                  d = p1[1];
              } else {
                throw Fraction["InvalidParameter"];
              }
              s = n * d;
              break;
            }
            case "number": {
              if (p1 < 0) {
                s = p1;
                p1 = -p1;
              }
              if (p1 % 1 === 0) {
                n = p1;
              } else if (p1 > 0) {
                if (p1 >= 1) {
                  z = Math.pow(10, Math.floor(1 + Math.log(p1) / Math.LN10));
                  p1 /= z;
                }
                while (B <= N && D <= N) {
                  M = (A + C) / (B + D);
                  if (p1 === M) {
                    if (B + D <= N) {
                      n = A + C;
                      d = B + D;
                    } else if (D > B) {
                      n = C;
                      d = D;
                    } else {
                      n = A;
                      d = B;
                    }
                    break;
                  } else {
                    if (p1 > M) {
                      A += C;
                      B += D;
                    } else {
                      C += A;
                      D += B;
                    }
                    if (B > N) {
                      n = C;
                      d = D;
                    } else {
                      n = A;
                      d = B;
                    }
                  }
                }
                n *= z;
              } else if (isNaN(p1) || isNaN(p2)) {
                d = n = NaN;
              }
              break;
            }
            case "string": {
              B = p1.match(/\d+|./g);
              if (B === null)
                throw Fraction["InvalidParameter"];
              if (B[A] === "-") {
                s = -1;
                A++;
              } else if (B[A] === "+") {
                A++;
              }
              if (B.length === A + 1) {
                w = assign(B[A++], s);
              } else if (B[A + 1] === "." || B[A] === ".") {
                if (B[A] !== ".") {
                  v = assign(B[A++], s);
                }
                A++;
                if (A + 1 === B.length || B[A + 1] === "(" && B[A + 3] === ")" || B[A + 1] === "'" && B[A + 3] === "'") {
                  w = assign(B[A], s);
                  y = Math.pow(10, B[A].length);
                  A++;
                }
                if (B[A] === "(" && B[A + 2] === ")" || B[A] === "'" && B[A + 2] === "'") {
                  x = assign(B[A + 1], s);
                  z = Math.pow(10, B[A + 1].length) - 1;
                  A += 3;
                }
              } else if (B[A + 1] === "/" || B[A + 1] === ":") {
                w = assign(B[A], s);
                y = assign(B[A + 2], 1);
                A += 3;
              } else if (B[A + 3] === "/" && B[A + 1] === " ") {
                v = assign(B[A], s);
                w = assign(B[A + 2], s);
                y = assign(B[A + 4], 1);
                A += 5;
              }
              if (B.length <= A) {
                d = y * z;
                s = n = x + d * v + z * w;
                break;
              }
            }
            default:
              throw Fraction["InvalidParameter"];
          }
        if (d === 0) {
          throw Fraction["DivisionByZero"];
        }
        P["s"] = s < 0 ? -1 : 1;
        P["n"] = Math.abs(n);
        P["d"] = Math.abs(d);
      };
      function modpow(b, e, m) {
        var r = 1;
        for (; e > 0; b = b * b % m, e >>= 1) {
          if (e & 1) {
            r = r * b % m;
          }
        }
        return r;
      }
      function cycleLen(n, d) {
        for (; d % 2 === 0; d /= 2) {
        }
        for (; d % 5 === 0; d /= 5) {
        }
        if (d === 1)
          return 0;
        var rem = 10 % d;
        var t = 1;
        for (; rem !== 1; t++) {
          rem = rem * 10 % d;
          if (t > MAX_CYCLE_LEN)
            return 0;
        }
        return t;
      }
      function cycleStart(n, d, len) {
        var rem1 = 1;
        var rem2 = modpow(10, len, d);
        for (var t = 0; t < 300; t++) {
          if (rem1 === rem2)
            return t;
          rem1 = rem1 * 10 % d;
          rem2 = rem2 * 10 % d;
        }
        return 0;
      }
      function gcd(a, b) {
        if (!a)
          return b;
        if (!b)
          return a;
        while (1) {
          a %= b;
          if (!a)
            return b;
          b %= a;
          if (!b)
            return a;
        }
      }
      ;
      function Fraction(a, b) {
        parse(a, b);
        if (this instanceof Fraction) {
          a = gcd(P["d"], P["n"]);
          this["s"] = P["s"];
          this["n"] = P["n"] / a;
          this["d"] = P["d"] / a;
        } else {
          return newFraction(P["s"] * P["n"], P["d"]);
        }
      }
      Fraction["DivisionByZero"] = new Error("Division by Zero");
      Fraction["InvalidParameter"] = new Error("Invalid argument");
      Fraction["NonIntegerParameter"] = new Error("Parameters must be integer");
      Fraction.prototype = {
        "s": 1,
        "n": 0,
        "d": 1,
        "abs": function() {
          return newFraction(this["n"], this["d"]);
        },
        "neg": function() {
          return newFraction(-this["s"] * this["n"], this["d"]);
        },
        "add": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"],
            this["d"] * P["d"]
          );
        },
        "sub": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"],
            this["d"] * P["d"]
          );
        },
        "mul": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * P["s"] * this["n"] * P["n"],
            this["d"] * P["d"]
          );
        },
        "div": function(a, b) {
          parse(a, b);
          return newFraction(
            this["s"] * P["s"] * this["n"] * P["d"],
            this["d"] * P["n"]
          );
        },
        "clone": function() {
          return newFraction(this["s"] * this["n"], this["d"]);
        },
        "mod": function(a, b) {
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction(NaN);
          }
          if (a === void 0) {
            return newFraction(this["s"] * this["n"] % this["d"], 1);
          }
          parse(a, b);
          if (0 === P["n"] && 0 === this["d"]) {
            throw Fraction["DivisionByZero"];
          }
          return newFraction(
            this["s"] * (P["d"] * this["n"]) % (P["n"] * this["d"]),
            P["d"] * this["d"]
          );
        },
        "gcd": function(a, b) {
          parse(a, b);
          return newFraction(gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]), P["d"] * this["d"]);
        },
        "lcm": function(a, b) {
          parse(a, b);
          if (P["n"] === 0 && this["n"] === 0) {
            return newFraction(0, 1);
          }
          return newFraction(P["n"] * this["n"], gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]));
        },
        "ceil": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction(NaN);
          }
          return newFraction(Math.ceil(places * this["s"] * this["n"] / this["d"]), places);
        },
        "floor": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction(NaN);
          }
          return newFraction(Math.floor(places * this["s"] * this["n"] / this["d"]), places);
        },
        "round": function(places) {
          places = Math.pow(10, places || 0);
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return new Fraction(NaN);
          }
          return newFraction(Math.round(places * this["s"] * this["n"] / this["d"]), places);
        },
        "inverse": function() {
          return newFraction(this["s"] * this["d"], this["n"]);
        },
        "pow": function(a, b) {
          parse(a, b);
          if (P["d"] === 1) {
            if (P["s"] < 0) {
              return newFraction(Math.pow(this["s"] * this["d"], P["n"]), Math.pow(this["n"], P["n"]));
            } else {
              return newFraction(Math.pow(this["s"] * this["n"], P["n"]), Math.pow(this["d"], P["n"]));
            }
          }
          if (this["s"] < 0)
            return null;
          var N = factorize(this["n"]);
          var D = factorize(this["d"]);
          var n = 1;
          var d = 1;
          for (var k in N) {
            if (k === "1")
              continue;
            if (k === "0") {
              n = 0;
              break;
            }
            N[k] *= P["n"];
            if (N[k] % P["d"] === 0) {
              N[k] /= P["d"];
            } else
              return null;
            n *= Math.pow(k, N[k]);
          }
          for (var k in D) {
            if (k === "1")
              continue;
            D[k] *= P["n"];
            if (D[k] % P["d"] === 0) {
              D[k] /= P["d"];
            } else
              return null;
            d *= Math.pow(k, D[k]);
          }
          if (P["s"] < 0) {
            return newFraction(d, n);
          }
          return newFraction(n, d);
        },
        "equals": function(a, b) {
          parse(a, b);
          return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"];
        },
        "compare": function(a, b) {
          parse(a, b);
          var t = this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"];
          return (0 < t) - (t < 0);
        },
        "simplify": function(eps) {
          if (isNaN(this["n"]) || isNaN(this["d"])) {
            return this;
          }
          eps = eps || 1e-3;
          var thisABS = this["abs"]();
          var cont = thisABS["toContinued"]();
          for (var i = 1; i < cont.length; i++) {
            var s = newFraction(cont[i - 1], 1);
            for (var k = i - 2; k >= 0; k--) {
              s = s["inverse"]()["add"](cont[k]);
            }
            if (s["sub"](thisABS)["abs"]().valueOf() < eps) {
              return s["mul"](this["s"]);
            }
          }
          return this;
        },
        "divisible": function(a, b) {
          parse(a, b);
          return !(!(P["n"] * this["d"]) || this["n"] * P["d"] % (P["n"] * this["d"]));
        },
        "valueOf": function() {
          return this["s"] * this["n"] / this["d"];
        },
        "toFraction": function(excludeWhole) {
          var whole, str = "";
          var n = this["n"];
          var d = this["d"];
          if (this["s"] < 0) {
            str += "-";
          }
          if (d === 1) {
            str += n;
          } else {
            if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
              str += whole;
              str += " ";
              n %= d;
            }
            str += n;
            str += "/";
            str += d;
          }
          return str;
        },
        "toLatex": function(excludeWhole) {
          var whole, str = "";
          var n = this["n"];
          var d = this["d"];
          if (this["s"] < 0) {
            str += "-";
          }
          if (d === 1) {
            str += n;
          } else {
            if (excludeWhole && (whole = Math.floor(n / d)) > 0) {
              str += whole;
              n %= d;
            }
            str += "\\frac{";
            str += n;
            str += "}{";
            str += d;
            str += "}";
          }
          return str;
        },
        "toContinued": function() {
          var t;
          var a = this["n"];
          var b = this["d"];
          var res = [];
          if (isNaN(a) || isNaN(b)) {
            return res;
          }
          do {
            res.push(Math.floor(a / b));
            t = a % b;
            a = b;
            b = t;
          } while (a !== 1);
          return res;
        },
        "toString": function(dec) {
          var N = this["n"];
          var D = this["d"];
          if (isNaN(N) || isNaN(D)) {
            return "NaN";
          }
          dec = dec || 15;
          var cycLen = cycleLen(N, D);
          var cycOff = cycleStart(N, D, cycLen);
          var str = this["s"] < 0 ? "-" : "";
          str += N / D | 0;
          N %= D;
          N *= 10;
          if (N)
            str += ".";
          if (cycLen) {
            for (var i = cycOff; i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
            str += "(";
            for (var i = cycLen; i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
            str += ")";
          } else {
            for (var i = dec; N && i--; ) {
              str += N / D | 0;
              N %= D;
              N *= 10;
            }
          }
          return str;
        }
      };
      if (typeof define === "function" && define["amd"]) {
        define([], function() {
          return Fraction;
        });
      } else if (typeof exports === "object") {
        Object.defineProperty(Fraction, "__esModule", { "value": true });
        Fraction["default"] = Fraction;
        Fraction["Fraction"] = Fraction;
        module["exports"] = Fraction;
      } else {
        root["Fraction"] = Fraction;
      }
    })(exports);
  }
});

// node_modules/autoprefixer/lib/resolution.js
var require_resolution = __commonJS({
  "node_modules/autoprefixer/lib/resolution.js"(exports, module) {
    var FractionJs = require_fraction();
    var Prefixer = require_prefixer();
    var utils = require_utils();
    var REGEXP = /(min|max)-resolution\s*:\s*\d*\.?\d+(dppx|dpcm|dpi|x)/gi;
    var SPLIT = /(min|max)-resolution(\s*:\s*)(\d*\.?\d+)(dppx|dpcm|dpi|x)/i;
    var Resolution = class extends Prefixer {
      prefixName(prefix, name) {
        if (prefix === "-moz-") {
          return name + "--moz-device-pixel-ratio";
        } else {
          return prefix + name + "-device-pixel-ratio";
        }
      }
      prefixQuery(prefix, name, colon, value, units) {
        value = new FractionJs(value);
        if (units === "dpi") {
          value = value.div(96);
        } else if (units === "dpcm") {
          value = value.mul(2.54).div(96);
        }
        value = value.simplify();
        if (prefix === "-o-") {
          value = value.n + "/" + value.d;
        }
        return this.prefixName(prefix, name) + colon + value;
      }
      clean(rule) {
        if (!this.bad) {
          this.bad = [];
          for (let prefix of this.prefixes) {
            this.bad.push(this.prefixName(prefix, "min"));
            this.bad.push(this.prefixName(prefix, "max"));
          }
        }
        rule.params = utils.editList(rule.params, (queries) => {
          return queries.filter((query) => this.bad.every((i) => !query.includes(i)));
        });
      }
      process(rule) {
        let parent = this.parentPrefix(rule);
        let prefixes = parent ? [parent] : this.prefixes;
        rule.params = utils.editList(rule.params, (origin, prefixed) => {
          for (let query of origin) {
            if (!query.includes("min-resolution") && !query.includes("max-resolution")) {
              prefixed.push(query);
              continue;
            }
            for (let prefix of prefixes) {
              let processed = query.replace(REGEXP, (str) => {
                let parts = str.match(SPLIT);
                return this.prefixQuery(
                  prefix,
                  parts[1],
                  parts[2],
                  parts[3],
                  parts[4]
                );
              });
              prefixed.push(processed);
            }
            prefixed.push(query);
          }
          return utils.uniq(prefixed);
        });
      }
    };
    module.exports = Resolution;
  }
});

// node_modules/autoprefixer/lib/transition.js
var require_transition = __commonJS({
  "node_modules/autoprefixer/lib/transition.js"(exports, module) {
    var { list } = require_postcss();
    var parser = require_lib();
    var Browsers = require_browsers();
    var vendor = require_vendor();
    var Transition = class {
      constructor(prefixes) {
        this.props = ["transition", "transition-property"];
        this.prefixes = prefixes;
      }
      add(decl, result) {
        let prefix, prop;
        let add = this.prefixes.add[decl.prop];
        let vendorPrefixes = this.ruleVendorPrefixes(decl);
        let declPrefixes = vendorPrefixes || add && add.prefixes || [];
        let params = this.parse(decl.value);
        let names = params.map((i) => this.findProp(i));
        let added = [];
        if (names.some((i) => i[0] === "-")) {
          return;
        }
        for (let param of params) {
          prop = this.findProp(param);
          if (prop[0] === "-")
            continue;
          let prefixer = this.prefixes.add[prop];
          if (!prefixer || !prefixer.prefixes)
            continue;
          for (prefix of prefixer.prefixes) {
            if (vendorPrefixes && !vendorPrefixes.some((p) => prefix.includes(p))) {
              continue;
            }
            let prefixed = this.prefixes.prefixed(prop, prefix);
            if (prefixed !== "-ms-transform" && !names.includes(prefixed)) {
              if (!this.disabled(prop, prefix)) {
                added.push(this.clone(prop, prefixed, param));
              }
            }
          }
        }
        params = params.concat(added);
        let value = this.stringify(params);
        let webkitClean = this.stringify(
          this.cleanFromUnprefixed(params, "-webkit-")
        );
        if (declPrefixes.includes("-webkit-")) {
          this.cloneBefore(decl, `-webkit-${decl.prop}`, webkitClean);
        }
        this.cloneBefore(decl, decl.prop, webkitClean);
        if (declPrefixes.includes("-o-")) {
          let operaClean = this.stringify(this.cleanFromUnprefixed(params, "-o-"));
          this.cloneBefore(decl, `-o-${decl.prop}`, operaClean);
        }
        for (prefix of declPrefixes) {
          if (prefix !== "-webkit-" && prefix !== "-o-") {
            let prefixValue = this.stringify(
              this.cleanOtherPrefixes(params, prefix)
            );
            this.cloneBefore(decl, prefix + decl.prop, prefixValue);
          }
        }
        if (value !== decl.value && !this.already(decl, decl.prop, value)) {
          this.checkForWarning(result, decl);
          decl.cloneBefore();
          decl.value = value;
        }
      }
      findProp(param) {
        let prop = param[0].value;
        if (/^\d/.test(prop)) {
          for (let [i, token] of param.entries()) {
            if (i !== 0 && token.type === "word") {
              return token.value;
            }
          }
        }
        return prop;
      }
      already(decl, prop, value) {
        return decl.parent.some((i) => i.prop === prop && i.value === value);
      }
      cloneBefore(decl, prop, value) {
        if (!this.already(decl, prop, value)) {
          decl.cloneBefore({ prop, value });
        }
      }
      checkForWarning(result, decl) {
        if (decl.prop !== "transition-property") {
          return;
        }
        let isPrefixed = false;
        let hasAssociatedProp = false;
        decl.parent.each((i) => {
          if (i.type !== "decl") {
            return void 0;
          }
          if (i.prop.indexOf("transition-") !== 0) {
            return void 0;
          }
          let values = list.comma(i.value);
          if (i.prop === "transition-property") {
            values.forEach((value) => {
              let lookup = this.prefixes.add[value];
              if (lookup && lookup.prefixes && lookup.prefixes.length > 0) {
                isPrefixed = true;
              }
            });
            return void 0;
          }
          hasAssociatedProp = hasAssociatedProp || values.length > 1;
          return false;
        });
        if (isPrefixed && hasAssociatedProp) {
          decl.warn(
            result,
            "Replace transition-property to transition, because Autoprefixer could not support any cases of transition-property and other transition-*"
          );
        }
      }
      remove(decl) {
        let params = this.parse(decl.value);
        params = params.filter((i) => {
          let prop = this.prefixes.remove[this.findProp(i)];
          return !prop || !prop.remove;
        });
        let value = this.stringify(params);
        if (decl.value === value) {
          return;
        }
        if (params.length === 0) {
          decl.remove();
          return;
        }
        let double = decl.parent.some((i) => {
          return i.prop === decl.prop && i.value === value;
        });
        let smaller = decl.parent.some((i) => {
          return i !== decl && i.prop === decl.prop && i.value.length > value.length;
        });
        if (double || smaller) {
          decl.remove();
          return;
        }
        decl.value = value;
      }
      parse(value) {
        let ast = parser(value);
        let result = [];
        let param = [];
        for (let node of ast.nodes) {
          param.push(node);
          if (node.type === "div" && node.value === ",") {
            result.push(param);
            param = [];
          }
        }
        result.push(param);
        return result.filter((i) => i.length > 0);
      }
      stringify(params) {
        if (params.length === 0) {
          return "";
        }
        let nodes = [];
        for (let param of params) {
          if (param[param.length - 1].type !== "div") {
            param.push(this.div(params));
          }
          nodes = nodes.concat(param);
        }
        if (nodes[0].type === "div") {
          nodes = nodes.slice(1);
        }
        if (nodes[nodes.length - 1].type === "div") {
          nodes = nodes.slice(0, -2 + 1 || void 0);
        }
        return parser.stringify({ nodes });
      }
      clone(origin, name, param) {
        let result = [];
        let changed = false;
        for (let i of param) {
          if (!changed && i.type === "word" && i.value === origin) {
            result.push({ type: "word", value: name });
            changed = true;
          } else {
            result.push(i);
          }
        }
        return result;
      }
      div(params) {
        for (let param of params) {
          for (let node of param) {
            if (node.type === "div" && node.value === ",") {
              return node;
            }
          }
        }
        return { type: "div", value: ",", after: " " };
      }
      cleanOtherPrefixes(params, prefix) {
        return params.filter((param) => {
          let current = vendor.prefix(this.findProp(param));
          return current === "" || current === prefix;
        });
      }
      cleanFromUnprefixed(params, prefix) {
        let remove = params.map((i) => this.findProp(i)).filter((i) => i.slice(0, prefix.length) === prefix).map((i) => this.prefixes.unprefixed(i));
        let result = [];
        for (let param of params) {
          let prop = this.findProp(param);
          let p = vendor.prefix(prop);
          if (!remove.includes(prop) && (p === prefix || p === "")) {
            result.push(param);
          }
        }
        return result;
      }
      disabled(prop, prefix) {
        let other = ["order", "justify-content", "align-self", "align-content"];
        if (prop.includes("flex") || other.includes(prop)) {
          if (this.prefixes.options.flexbox === false) {
            return true;
          }
          if (this.prefixes.options.flexbox === "no-2009") {
            return prefix.includes("2009");
          }
        }
        return void 0;
      }
      ruleVendorPrefixes(decl) {
        let { parent } = decl;
        if (parent.type !== "rule") {
          return false;
        } else if (!parent.selector.includes(":-")) {
          return false;
        }
        let selectors = Browsers.prefixes().filter(
          (s) => parent.selector.includes(":" + s)
        );
        return selectors.length > 0 ? selectors : false;
      }
    };
    module.exports = Transition;
  }
});

// node_modules/autoprefixer/lib/old-value.js
var require_old_value = __commonJS({
  "node_modules/autoprefixer/lib/old-value.js"(exports, module) {
    var utils = require_utils();
    var OldValue = class {
      constructor(unprefixed, prefixed, string, regexp) {
        this.unprefixed = unprefixed;
        this.prefixed = prefixed;
        this.string = string || prefixed;
        this.regexp = regexp || utils.regexp(prefixed);
      }
      check(value) {
        if (value.includes(this.string)) {
          return !!value.match(this.regexp);
        }
        return false;
      }
    };
    module.exports = OldValue;
  }
});

// node_modules/autoprefixer/lib/value.js
var require_value = __commonJS({
  "node_modules/autoprefixer/lib/value.js"(exports, module) {
    var Prefixer = require_prefixer();
    var OldValue = require_old_value();
    var vendor = require_vendor();
    var utils = require_utils();
    var Value = class extends Prefixer {
      static save(prefixes, decl) {
        let prop = decl.prop;
        let result = [];
        for (let prefix in decl._autoprefixerValues) {
          let value = decl._autoprefixerValues[prefix];
          if (value === decl.value) {
            continue;
          }
          let item;
          let propPrefix = vendor.prefix(prop);
          if (propPrefix === "-pie-") {
            continue;
          }
          if (propPrefix === prefix) {
            item = decl.value = value;
            result.push(item);
            continue;
          }
          let prefixed = prefixes.prefixed(prop, prefix);
          let rule = decl.parent;
          if (!rule.every((i) => i.prop !== prefixed)) {
            result.push(item);
            continue;
          }
          let trimmed = value.replace(/\s+/, " ");
          let already = rule.some(
            (i) => i.prop === decl.prop && i.value.replace(/\s+/, " ") === trimmed
          );
          if (already) {
            result.push(item);
            continue;
          }
          let cloned = this.clone(decl, { value });
          item = decl.parent.insertBefore(decl, cloned);
          result.push(item);
        }
        return result;
      }
      check(decl) {
        let value = decl.value;
        if (!value.includes(this.name)) {
          return false;
        }
        return !!value.match(this.regexp());
      }
      regexp() {
        return this.regexpCache || (this.regexpCache = utils.regexp(this.name));
      }
      replace(string, prefix) {
        return string.replace(this.regexp(), `$1${prefix}$2`);
      }
      value(decl) {
        if (decl.raws.value && decl.raws.value.value === decl.value) {
          return decl.raws.value.raw;
        } else {
          return decl.value;
        }
      }
      add(decl, prefix) {
        if (!decl._autoprefixerValues) {
          decl._autoprefixerValues = {};
        }
        let value = decl._autoprefixerValues[prefix] || this.value(decl);
        let before;
        do {
          before = value;
          value = this.replace(value, prefix);
          if (value === false)
            return;
        } while (value !== before);
        decl._autoprefixerValues[prefix] = value;
      }
      old(prefix) {
        return new OldValue(this.name, prefix + this.name);
      }
    };
    module.exports = Value;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-utils.js
var require_grid_utils = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-utils.js"(exports) {
    var parser = require_lib();
    var list = require_postcss().list;
    var uniq = require_utils().uniq;
    var escapeRegexp = require_utils().escapeRegexp;
    var splitSelector = require_utils().splitSelector;
    function convert(value) {
      if (value && value.length === 2 && value[0] === "span" && parseInt(value[1], 10) > 0) {
        return [false, parseInt(value[1], 10)];
      }
      if (value && value.length === 1 && parseInt(value[0], 10) > 0) {
        return [parseInt(value[0], 10), false];
      }
      return [false, false];
    }
    exports.translate = translate;
    function translate(values, startIndex, endIndex) {
      let startValue = values[startIndex];
      let endValue = values[endIndex];
      if (!startValue) {
        return [false, false];
      }
      let [start, spanStart] = convert(startValue);
      let [end, spanEnd] = convert(endValue);
      if (start && !endValue) {
        return [start, false];
      }
      if (spanStart && end) {
        return [end - spanStart, spanStart];
      }
      if (start && spanEnd) {
        return [start, spanEnd];
      }
      if (start && end) {
        return [start, end - start];
      }
      return [false, false];
    }
    exports.parse = parse;
    function parse(decl) {
      let node = parser(decl.value);
      let values = [];
      let current = 0;
      values[current] = [];
      for (let i of node.nodes) {
        if (i.type === "div") {
          current += 1;
          values[current] = [];
        } else if (i.type === "word") {
          values[current].push(i.value);
        }
      }
      return values;
    }
    exports.insertDecl = insertDecl;
    function insertDecl(decl, prop, value) {
      if (value && !decl.parent.some((i) => i.prop === `-ms-${prop}`)) {
        decl.cloneBefore({
          prop: `-ms-${prop}`,
          value: value.toString()
        });
      }
    }
    exports.prefixTrackProp = prefixTrackProp;
    function prefixTrackProp({ prop, prefix }) {
      return prefix + prop.replace("template-", "");
    }
    function transformRepeat({ nodes }, { gap }) {
      let { count, size } = nodes.reduce(
        (result, node) => {
          if (node.type === "div" && node.value === ",") {
            result.key = "size";
          } else {
            result[result.key].push(parser.stringify(node));
          }
          return result;
        },
        {
          key: "count",
          size: [],
          count: []
        }
      );
      if (gap) {
        size = size.filter((i) => i.trim());
        let val = [];
        for (let i = 1; i <= count; i++) {
          size.forEach((item, index) => {
            if (index > 0 || i > 1) {
              val.push(gap);
            }
            val.push(item);
          });
        }
        return val.join(" ");
      }
      return `(${size.join("")})[${count.join("")}]`;
    }
    exports.prefixTrackValue = prefixTrackValue;
    function prefixTrackValue({ value, gap }) {
      let result = parser(value).nodes.reduce((nodes, node) => {
        if (node.type === "function" && node.value === "repeat") {
          return nodes.concat({
            type: "word",
            value: transformRepeat(node, { gap })
          });
        }
        if (gap && node.type === "space") {
          return nodes.concat(
            {
              type: "space",
              value: " "
            },
            {
              type: "word",
              value: gap
            },
            node
          );
        }
        return nodes.concat(node);
      }, []);
      return parser.stringify(result);
    }
    var DOTS = /^\.+$/;
    function track(start, end) {
      return { start, end, span: end - start };
    }
    function getColumns(line) {
      return line.trim().split(/\s+/g);
    }
    exports.parseGridAreas = parseGridAreas;
    function parseGridAreas({ rows, gap }) {
      return rows.reduce((areas, line, rowIndex) => {
        if (gap.row)
          rowIndex *= 2;
        if (line.trim() === "")
          return areas;
        getColumns(line).forEach((area, columnIndex) => {
          if (DOTS.test(area))
            return;
          if (gap.column)
            columnIndex *= 2;
          if (typeof areas[area] === "undefined") {
            areas[area] = {
              column: track(columnIndex + 1, columnIndex + 2),
              row: track(rowIndex + 1, rowIndex + 2)
            };
          } else {
            let { column, row } = areas[area];
            column.start = Math.min(column.start, columnIndex + 1);
            column.end = Math.max(column.end, columnIndex + 2);
            column.span = column.end - column.start;
            row.start = Math.min(row.start, rowIndex + 1);
            row.end = Math.max(row.end, rowIndex + 2);
            row.span = row.end - row.start;
          }
        });
        return areas;
      }, {});
    }
    function testTrack(node) {
      return node.type === "word" && /^\[.+]$/.test(node.value);
    }
    function verifyRowSize(result) {
      if (result.areas.length > result.rows.length) {
        result.rows.push("auto");
      }
      return result;
    }
    exports.parseTemplate = parseTemplate;
    function parseTemplate({ decl, gap }) {
      let gridTemplate = parser(decl.value).nodes.reduce(
        (result, node) => {
          let { type, value } = node;
          if (testTrack(node) || type === "space")
            return result;
          if (type === "string") {
            result = verifyRowSize(result);
            result.areas.push(value);
          }
          if (type === "word" || type === "function") {
            result[result.key].push(parser.stringify(node));
          }
          if (type === "div" && value === "/") {
            result.key = "columns";
            result = verifyRowSize(result);
          }
          return result;
        },
        {
          key: "rows",
          columns: [],
          rows: [],
          areas: []
        }
      );
      return {
        areas: parseGridAreas({
          rows: gridTemplate.areas,
          gap
        }),
        columns: prefixTrackValue({
          value: gridTemplate.columns.join(" "),
          gap: gap.column
        }),
        rows: prefixTrackValue({
          value: gridTemplate.rows.join(" "),
          gap: gap.row
        })
      };
    }
    function getMSDecls(area, addRowSpan = false, addColumnSpan = false) {
      let result = [
        {
          prop: "-ms-grid-row",
          value: String(area.row.start)
        }
      ];
      if (area.row.span > 1 || addRowSpan) {
        result.push({
          prop: "-ms-grid-row-span",
          value: String(area.row.span)
        });
      }
      result.push({
        prop: "-ms-grid-column",
        value: String(area.column.start)
      });
      if (area.column.span > 1 || addColumnSpan) {
        result.push({
          prop: "-ms-grid-column-span",
          value: String(area.column.span)
        });
      }
      return result;
    }
    function getParentMedia(parent) {
      if (parent.type === "atrule" && parent.name === "media") {
        return parent;
      }
      if (!parent.parent) {
        return false;
      }
      return getParentMedia(parent.parent);
    }
    function changeDuplicateAreaSelectors(ruleSelectors, templateSelectors) {
      ruleSelectors = ruleSelectors.map((selector) => {
        let selectorBySpace = list.space(selector);
        let selectorByComma = list.comma(selector);
        if (selectorBySpace.length > selectorByComma.length) {
          selector = selectorBySpace.slice(-1).join("");
        }
        return selector;
      });
      return ruleSelectors.map((ruleSelector) => {
        let newSelector = templateSelectors.map((tplSelector, index) => {
          let space = index === 0 ? "" : " ";
          return `${space}${tplSelector} > ${ruleSelector}`;
        });
        return newSelector;
      });
    }
    function selectorsEqual(ruleA, ruleB) {
      return ruleA.selectors.some((sel) => {
        return ruleB.selectors.includes(sel);
      });
    }
    function parseGridTemplatesData(css) {
      let parsed = [];
      css.walkDecls(/grid-template(-areas)?$/, (d) => {
        let rule = d.parent;
        let media = getParentMedia(rule);
        let gap = getGridGap(d);
        let inheritedGap = inheritGridGap(d, gap);
        let { areas } = parseTemplate({ decl: d, gap: inheritedGap || gap });
        let areaNames = Object.keys(areas);
        if (areaNames.length === 0) {
          return true;
        }
        let index = parsed.reduce((acc, { allAreas }, idx) => {
          let hasAreas = allAreas && areaNames.some((area) => allAreas.includes(area));
          return hasAreas ? idx : acc;
        }, null);
        if (index !== null) {
          let { allAreas, rules } = parsed[index];
          let hasNoDuplicates = rules.some((r) => {
            return r.hasDuplicates === false && selectorsEqual(r, rule);
          });
          let duplicatesFound = false;
          let duplicateAreaNames = rules.reduce((acc, r) => {
            if (!r.params && selectorsEqual(r, rule)) {
              duplicatesFound = true;
              return r.duplicateAreaNames;
            }
            if (!duplicatesFound) {
              areaNames.forEach((name) => {
                if (r.areas[name]) {
                  acc.push(name);
                }
              });
            }
            return uniq(acc);
          }, []);
          rules.forEach((r) => {
            areaNames.forEach((name) => {
              let area = r.areas[name];
              if (area && area.row.span !== areas[name].row.span) {
                areas[name].row.updateSpan = true;
              }
              if (area && area.column.span !== areas[name].column.span) {
                areas[name].column.updateSpan = true;
              }
            });
          });
          parsed[index].allAreas = uniq([...allAreas, ...areaNames]);
          parsed[index].rules.push({
            hasDuplicates: !hasNoDuplicates,
            params: media.params,
            selectors: rule.selectors,
            node: rule,
            duplicateAreaNames,
            areas
          });
        } else {
          parsed.push({
            allAreas: areaNames,
            areasCount: 0,
            rules: [
              {
                hasDuplicates: false,
                duplicateRules: [],
                params: media.params,
                selectors: rule.selectors,
                node: rule,
                duplicateAreaNames: [],
                areas
              }
            ]
          });
        }
        return void 0;
      });
      return parsed;
    }
    exports.insertAreas = insertAreas;
    function insertAreas(css, isDisabled) {
      let gridTemplatesData = parseGridTemplatesData(css);
      if (gridTemplatesData.length === 0) {
        return void 0;
      }
      let rulesToInsert = {};
      css.walkDecls("grid-area", (gridArea) => {
        let gridAreaRule = gridArea.parent;
        let hasPrefixedRow = gridAreaRule.first.prop === "-ms-grid-row";
        let gridAreaMedia = getParentMedia(gridAreaRule);
        if (isDisabled(gridArea)) {
          return void 0;
        }
        let gridAreaRuleIndex = css.index(gridAreaMedia || gridAreaRule);
        let value = gridArea.value;
        let data = gridTemplatesData.filter((d) => d.allAreas.includes(value))[0];
        if (!data) {
          return true;
        }
        let lastArea = data.allAreas[data.allAreas.length - 1];
        let selectorBySpace = list.space(gridAreaRule.selector);
        let selectorByComma = list.comma(gridAreaRule.selector);
        let selectorIsComplex = selectorBySpace.length > 1 && selectorBySpace.length > selectorByComma.length;
        if (hasPrefixedRow) {
          return false;
        }
        if (!rulesToInsert[lastArea]) {
          rulesToInsert[lastArea] = {};
        }
        let lastRuleIsSet = false;
        for (let rule of data.rules) {
          let area = rule.areas[value];
          let hasDuplicateName = rule.duplicateAreaNames.includes(value);
          if (!area) {
            let lastRule = rulesToInsert[lastArea].lastRule;
            let lastRuleIndex;
            if (lastRule) {
              lastRuleIndex = css.index(lastRule);
            } else {
              lastRuleIndex = -1;
            }
            if (gridAreaRuleIndex > lastRuleIndex) {
              rulesToInsert[lastArea].lastRule = gridAreaMedia || gridAreaRule;
            }
            continue;
          }
          if (rule.params && !rulesToInsert[lastArea][rule.params]) {
            rulesToInsert[lastArea][rule.params] = [];
          }
          if ((!rule.hasDuplicates || !hasDuplicateName) && !rule.params) {
            getMSDecls(area, false, false).reverse().forEach(
              (i) => gridAreaRule.prepend(
                Object.assign(i, {
                  raws: {
                    between: gridArea.raws.between
                  }
                })
              )
            );
            rulesToInsert[lastArea].lastRule = gridAreaRule;
            lastRuleIsSet = true;
          } else if (rule.hasDuplicates && !rule.params && !selectorIsComplex) {
            let cloned = gridAreaRule.clone();
            cloned.removeAll();
            getMSDecls(area, area.row.updateSpan, area.column.updateSpan).reverse().forEach(
              (i) => cloned.prepend(
                Object.assign(i, {
                  raws: {
                    between: gridArea.raws.between
                  }
                })
              )
            );
            cloned.selectors = changeDuplicateAreaSelectors(
              cloned.selectors,
              rule.selectors
            );
            if (rulesToInsert[lastArea].lastRule) {
              rulesToInsert[lastArea].lastRule.after(cloned);
            }
            rulesToInsert[lastArea].lastRule = cloned;
            lastRuleIsSet = true;
          } else if (rule.hasDuplicates && !rule.params && selectorIsComplex && gridAreaRule.selector.includes(rule.selectors[0])) {
            gridAreaRule.walkDecls(/-ms-grid-(row|column)/, (d) => d.remove());
            getMSDecls(area, area.row.updateSpan, area.column.updateSpan).reverse().forEach(
              (i) => gridAreaRule.prepend(
                Object.assign(i, {
                  raws: {
                    between: gridArea.raws.between
                  }
                })
              )
            );
          } else if (rule.params) {
            let cloned = gridAreaRule.clone();
            cloned.removeAll();
            getMSDecls(area, area.row.updateSpan, area.column.updateSpan).reverse().forEach(
              (i) => cloned.prepend(
                Object.assign(i, {
                  raws: {
                    between: gridArea.raws.between
                  }
                })
              )
            );
            if (rule.hasDuplicates && hasDuplicateName) {
              cloned.selectors = changeDuplicateAreaSelectors(
                cloned.selectors,
                rule.selectors
              );
            }
            cloned.raws = rule.node.raws;
            if (css.index(rule.node.parent) > gridAreaRuleIndex) {
              rule.node.parent.append(cloned);
            } else {
              rulesToInsert[lastArea][rule.params].push(cloned);
            }
            if (!lastRuleIsSet) {
              rulesToInsert[lastArea].lastRule = gridAreaMedia || gridAreaRule;
            }
          }
        }
        return void 0;
      });
      Object.keys(rulesToInsert).forEach((area) => {
        let data = rulesToInsert[area];
        let lastRule = data.lastRule;
        Object.keys(data).reverse().filter((p) => p !== "lastRule").forEach((params) => {
          if (data[params].length > 0 && lastRule) {
            lastRule.after({ name: "media", params });
            lastRule.next().append(data[params]);
          }
        });
      });
      return void 0;
    }
    exports.warnMissedAreas = warnMissedAreas;
    function warnMissedAreas(areas, decl, result) {
      let missed = Object.keys(areas);
      decl.root().walkDecls("grid-area", (gridArea) => {
        missed = missed.filter((e) => e !== gridArea.value);
      });
      if (missed.length > 0) {
        decl.warn(result, "Can not find grid areas: " + missed.join(", "));
      }
      return void 0;
    }
    exports.warnTemplateSelectorNotFound = warnTemplateSelectorNotFound;
    function warnTemplateSelectorNotFound(decl, result) {
      let rule = decl.parent;
      let root = decl.root();
      let duplicatesFound = false;
      let slicedSelectorArr = list.space(rule.selector).filter((str) => str !== ">").slice(0, -1);
      if (slicedSelectorArr.length > 0) {
        let gridTemplateFound = false;
        let foundAreaSelector = null;
        root.walkDecls(/grid-template(-areas)?$/, (d) => {
          let parent = d.parent;
          let templateSelectors = parent.selectors;
          let { areas } = parseTemplate({ decl: d, gap: getGridGap(d) });
          let hasArea = areas[decl.value];
          for (let tplSelector of templateSelectors) {
            if (gridTemplateFound) {
              break;
            }
            let tplSelectorArr = list.space(tplSelector).filter((str) => str !== ">");
            gridTemplateFound = tplSelectorArr.every(
              (item, idx) => item === slicedSelectorArr[idx]
            );
          }
          if (gridTemplateFound || !hasArea) {
            return true;
          }
          if (!foundAreaSelector) {
            foundAreaSelector = parent.selector;
          }
          if (foundAreaSelector && foundAreaSelector !== parent.selector) {
            duplicatesFound = true;
          }
          return void 0;
        });
        if (!gridTemplateFound && duplicatesFound) {
          decl.warn(
            result,
            `Autoprefixer cannot find a grid-template containing the duplicate grid-area "${decl.value}" with full selector matching: ${slicedSelectorArr.join(" ")}`
          );
        }
      }
    }
    exports.warnIfGridRowColumnExists = warnIfGridRowColumnExists;
    function warnIfGridRowColumnExists(decl, result) {
      let rule = decl.parent;
      let decls = [];
      rule.walkDecls(/^grid-(row|column)/, (d) => {
        if (!d.prop.endsWith("-end") && !d.value.startsWith("span") && !d.prop.endsWith("-gap")) {
          decls.push(d);
        }
      });
      if (decls.length > 0) {
        decls.forEach((d) => {
          d.warn(
            result,
            `You already have a grid-area declaration present in the rule. You should use either grid-area or ${d.prop}, not both`
          );
        });
      }
      return void 0;
    }
    exports.getGridGap = getGridGap;
    function getGridGap(decl) {
      let gap = {};
      let testGap = /^(grid-)?((row|column)-)?gap$/;
      decl.parent.walkDecls(testGap, ({ prop, value }) => {
        if (/^(grid-)?gap$/.test(prop)) {
          let [row, , column] = parser(value).nodes;
          gap.row = row && parser.stringify(row);
          gap.column = column ? parser.stringify(column) : gap.row;
        }
        if (/^(grid-)?row-gap$/.test(prop))
          gap.row = value;
        if (/^(grid-)?column-gap$/.test(prop))
          gap.column = value;
      });
      return gap;
    }
    function parseMediaParams(params) {
      if (!params) {
        return [];
      }
      let parsed = parser(params);
      let prop;
      let value;
      parsed.walk((node) => {
        if (node.type === "word" && /min|max/g.test(node.value)) {
          prop = node.value;
        } else if (node.value.includes("px")) {
          value = parseInt(node.value.replace(/\D/g, ""));
        }
      });
      return [prop, value];
    }
    function shouldInheritGap(selA, selB) {
      let result;
      let splitSelectorArrA = splitSelector(selA);
      let splitSelectorArrB = splitSelector(selB);
      if (splitSelectorArrA[0].length < splitSelectorArrB[0].length) {
        return false;
      } else if (splitSelectorArrA[0].length > splitSelectorArrB[0].length) {
        let idx = splitSelectorArrA[0].reduce((res, [item], index) => {
          let firstSelectorPart = splitSelectorArrB[0][0][0];
          if (item === firstSelectorPart) {
            return index;
          }
          return false;
        }, false);
        if (idx) {
          result = splitSelectorArrB[0].every((arr, index) => {
            return arr.every(
              (part, innerIndex) => splitSelectorArrA[0].slice(idx)[index][innerIndex] === part
            );
          });
        }
      } else {
        result = splitSelectorArrB.some((byCommaArr) => {
          return byCommaArr.every((bySpaceArr, index) => {
            return bySpaceArr.every(
              (part, innerIndex) => splitSelectorArrA[0][index][innerIndex] === part
            );
          });
        });
      }
      return result;
    }
    exports.inheritGridGap = inheritGridGap;
    function inheritGridGap(decl, gap) {
      let rule = decl.parent;
      let mediaRule = getParentMedia(rule);
      let root = rule.root();
      let splitSelectorArr = splitSelector(rule.selector);
      if (Object.keys(gap).length > 0) {
        return false;
      }
      let [prop] = parseMediaParams(mediaRule.params);
      let lastBySpace = splitSelectorArr[0];
      let escaped = escapeRegexp(lastBySpace[lastBySpace.length - 1][0]);
      let regexp = new RegExp(`(${escaped}$)|(${escaped}[,.])`);
      let closestRuleGap;
      root.walkRules(regexp, (r) => {
        let gridGap;
        if (rule.toString() === r.toString()) {
          return false;
        }
        r.walkDecls("grid-gap", (d) => gridGap = getGridGap(d));
        if (!gridGap || Object.keys(gridGap).length === 0) {
          return true;
        }
        if (!shouldInheritGap(rule.selector, r.selector)) {
          return true;
        }
        let media = getParentMedia(r);
        if (media) {
          let propToCompare = parseMediaParams(media.params)[0];
          if (propToCompare === prop) {
            closestRuleGap = gridGap;
            return true;
          }
        } else {
          closestRuleGap = gridGap;
          return true;
        }
        return void 0;
      });
      if (closestRuleGap && Object.keys(closestRuleGap).length > 0) {
        return closestRuleGap;
      }
      return false;
    }
    exports.warnGridGap = warnGridGap;
    function warnGridGap({ gap, hasColumns, decl, result }) {
      let hasBothGaps = gap.row && gap.column;
      if (!hasColumns && (hasBothGaps || gap.column && !gap.row)) {
        delete gap.column;
        decl.warn(
          result,
          "Can not implement grid-gap without grid-template-columns"
        );
      }
    }
    function normalizeRowColumn(str) {
      let normalized = parser(str).nodes.reduce((result, node) => {
        if (node.type === "function" && node.value === "repeat") {
          let key = "count";
          let [count, value] = node.nodes.reduce(
            (acc, n) => {
              if (n.type === "word" && key === "count") {
                acc[0] = Math.abs(parseInt(n.value));
                return acc;
              }
              if (n.type === "div" && n.value === ",") {
                key = "value";
                return acc;
              }
              if (key === "value") {
                acc[1] += parser.stringify(n);
              }
              return acc;
            },
            [0, ""]
          );
          if (count) {
            for (let i = 0; i < count; i++) {
              result.push(value);
            }
          }
          return result;
        }
        if (node.type === "space") {
          return result;
        }
        return result.concat(parser.stringify(node));
      }, []);
      return normalized;
    }
    exports.autoplaceGridItems = autoplaceGridItems;
    function autoplaceGridItems(decl, result, gap, autoflowValue = "row") {
      let { parent } = decl;
      let rowDecl = parent.nodes.find((i) => i.prop === "grid-template-rows");
      let rows = normalizeRowColumn(rowDecl.value);
      let columns = normalizeRowColumn(decl.value);
      let filledRows = rows.map((_, rowIndex) => {
        return Array.from(
          { length: columns.length },
          (v, k) => k + rowIndex * columns.length + 1
        ).join(" ");
      });
      let areas = parseGridAreas({ rows: filledRows, gap });
      let keys = Object.keys(areas);
      let items = keys.map((i) => areas[i]);
      if (autoflowValue.includes("column")) {
        items = items.sort((a, b) => a.column.start - b.column.start);
      }
      items.reverse().forEach((item, index) => {
        let { column, row } = item;
        let nodeSelector = parent.selectors.map((sel) => sel + ` > *:nth-child(${keys.length - index})`).join(", ");
        let node = parent.clone().removeAll();
        node.selector = nodeSelector;
        node.append({ prop: "-ms-grid-row", value: row.start });
        node.append({ prop: "-ms-grid-column", value: column.start });
        parent.after(node);
      });
      return void 0;
    }
  }
});

// node_modules/autoprefixer/lib/processor.js
var require_processor = __commonJS({
  "node_modules/autoprefixer/lib/processor.js"(exports, module) {
    var parser = require_lib();
    var Value = require_value();
    var insertAreas = require_grid_utils().insertAreas;
    var OLD_LINEAR = /(^|[^-])linear-gradient\(\s*(top|left|right|bottom)/i;
    var OLD_RADIAL = /(^|[^-])radial-gradient\(\s*\d+(\w*|%)\s+\d+(\w*|%)\s*,/i;
    var IGNORE_NEXT = /(!\s*)?autoprefixer:\s*ignore\s+next/i;
    var GRID_REGEX = /(!\s*)?autoprefixer\s*grid:\s*(on|off|(no-)?autoplace)/i;
    var SIZES = [
      "width",
      "height",
      "min-width",
      "max-width",
      "min-height",
      "max-height",
      "inline-size",
      "min-inline-size",
      "max-inline-size",
      "block-size",
      "min-block-size",
      "max-block-size"
    ];
    function hasGridTemplate(decl) {
      return decl.parent.some(
        (i) => i.prop === "grid-template" || i.prop === "grid-template-areas"
      );
    }
    function hasRowsAndColumns(decl) {
      let hasRows = decl.parent.some((i) => i.prop === "grid-template-rows");
      let hasColumns = decl.parent.some((i) => i.prop === "grid-template-columns");
      return hasRows && hasColumns;
    }
    var Processor = class {
      constructor(prefixes) {
        this.prefixes = prefixes;
      }
      add(css, result) {
        let resolution = this.prefixes.add["@resolution"];
        let keyframes = this.prefixes.add["@keyframes"];
        let viewport = this.prefixes.add["@viewport"];
        let supports = this.prefixes.add["@supports"];
        css.walkAtRules((rule) => {
          if (rule.name === "keyframes") {
            if (!this.disabled(rule, result)) {
              return keyframes && keyframes.process(rule);
            }
          } else if (rule.name === "viewport") {
            if (!this.disabled(rule, result)) {
              return viewport && viewport.process(rule);
            }
          } else if (rule.name === "supports") {
            if (this.prefixes.options.supports !== false && !this.disabled(rule, result)) {
              return supports.process(rule);
            }
          } else if (rule.name === "media" && rule.params.includes("-resolution")) {
            if (!this.disabled(rule, result)) {
              return resolution && resolution.process(rule);
            }
          }
          return void 0;
        });
        css.walkRules((rule) => {
          if (this.disabled(rule, result))
            return void 0;
          return this.prefixes.add.selectors.map((selector) => {
            return selector.process(rule, result);
          });
        });
        function insideGrid(decl) {
          return decl.parent.nodes.some((node) => {
            if (node.type !== "decl")
              return false;
            let displayGrid = node.prop === "display" && /(inline-)?grid/.test(node.value);
            let gridTemplate = node.prop.startsWith("grid-template");
            let gridGap = /^grid-([A-z]+-)?gap/.test(node.prop);
            return displayGrid || gridTemplate || gridGap;
          });
        }
        function insideFlex(decl) {
          return decl.parent.some((node) => {
            return node.prop === "display" && /(inline-)?flex/.test(node.value);
          });
        }
        let gridPrefixes = this.gridStatus(css, result) && this.prefixes.add["grid-area"] && this.prefixes.add["grid-area"].prefixes;
        css.walkDecls((decl) => {
          if (this.disabledDecl(decl, result))
            return void 0;
          let parent = decl.parent;
          let prop = decl.prop;
          let value = decl.value;
          if (prop === "color-adjust") {
            if (parent.every((i) => i.prop !== "print-color-adjust")) {
              result.warn(
                "Replace color-adjust to print-color-adjust. The color-adjust shorthand is currently deprecated.",
                { node: decl }
              );
            }
          } else if (prop === "grid-row-span") {
            result.warn(
              "grid-row-span is not part of final Grid Layout. Use grid-row.",
              { node: decl }
            );
            return void 0;
          } else if (prop === "grid-column-span") {
            result.warn(
              "grid-column-span is not part of final Grid Layout. Use grid-column.",
              { node: decl }
            );
            return void 0;
          } else if (prop === "display" && value === "box") {
            result.warn(
              "You should write display: flex by final spec instead of display: box",
              { node: decl }
            );
            return void 0;
          } else if (prop === "text-emphasis-position") {
            if (value === "under" || value === "over") {
              result.warn(
                "You should use 2 values for text-emphasis-position For example, `under left` instead of just `under`.",
                { node: decl }
              );
            }
          } else if (/^(align|justify|place)-(items|content)$/.test(prop) && insideFlex(decl)) {
            if (value === "start" || value === "end") {
              result.warn(
                `${value} value has mixed support, consider using flex-${value} instead`,
                { node: decl }
              );
            }
          } else if (prop === "text-decoration-skip" && value === "ink") {
            result.warn(
              "Replace text-decoration-skip: ink to text-decoration-skip-ink: auto, because spec had been changed",
              { node: decl }
            );
          } else {
            if (gridPrefixes && this.gridStatus(decl, result)) {
              if (decl.value === "subgrid") {
                result.warn("IE does not support subgrid", { node: decl });
              }
              if (/^(align|justify|place)-items$/.test(prop) && insideGrid(decl)) {
                let fixed = prop.replace("-items", "-self");
                result.warn(
                  `IE does not support ${prop} on grid containers. Try using ${fixed} on child elements instead: ${decl.parent.selector} > * { ${fixed}: ${decl.value} }`,
                  { node: decl }
                );
              } else if (/^(align|justify|place)-content$/.test(prop) && insideGrid(decl)) {
                result.warn(`IE does not support ${decl.prop} on grid containers`, {
                  node: decl
                });
              } else if (prop === "display" && decl.value === "contents") {
                result.warn(
                  "Please do not use display: contents; if you have grid setting enabled",
                  { node: decl }
                );
                return void 0;
              } else if (decl.prop === "grid-gap") {
                let status = this.gridStatus(decl, result);
                if (status === "autoplace" && !hasRowsAndColumns(decl) && !hasGridTemplate(decl)) {
                  result.warn(
                    "grid-gap only works if grid-template(-areas) is being used or both rows and columns have been declared and cells have not been manually placed inside the explicit grid",
                    { node: decl }
                  );
                } else if ((status === true || status === "no-autoplace") && !hasGridTemplate(decl)) {
                  result.warn(
                    "grid-gap only works if grid-template(-areas) is being used",
                    { node: decl }
                  );
                }
              } else if (prop === "grid-auto-columns") {
                result.warn("grid-auto-columns is not supported by IE", {
                  node: decl
                });
                return void 0;
              } else if (prop === "grid-auto-rows") {
                result.warn("grid-auto-rows is not supported by IE", { node: decl });
                return void 0;
              } else if (prop === "grid-auto-flow") {
                let hasRows = parent.some((i) => i.prop === "grid-template-rows");
                let hasCols = parent.some((i) => i.prop === "grid-template-columns");
                if (hasGridTemplate(decl)) {
                  result.warn("grid-auto-flow is not supported by IE", {
                    node: decl
                  });
                } else if (value.includes("dense")) {
                  result.warn("grid-auto-flow: dense is not supported by IE", {
                    node: decl
                  });
                } else if (!hasRows && !hasCols) {
                  result.warn(
                    "grid-auto-flow works only if grid-template-rows and grid-template-columns are present in the same rule",
                    { node: decl }
                  );
                }
                return void 0;
              } else if (value.includes("auto-fit")) {
                result.warn("auto-fit value is not supported by IE", {
                  node: decl,
                  word: "auto-fit"
                });
                return void 0;
              } else if (value.includes("auto-fill")) {
                result.warn("auto-fill value is not supported by IE", {
                  node: decl,
                  word: "auto-fill"
                });
                return void 0;
              } else if (prop.startsWith("grid-template") && value.includes("[")) {
                result.warn(
                  "Autoprefixer currently does not support line names. Try using grid-template-areas instead.",
                  { node: decl, word: "[" }
                );
              }
            }
            if (value.includes("radial-gradient")) {
              if (OLD_RADIAL.test(decl.value)) {
                result.warn(
                  "Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.",
                  { node: decl }
                );
              } else {
                let ast = parser(value);
                for (let i of ast.nodes) {
                  if (i.type === "function" && i.value === "radial-gradient") {
                    for (let word of i.nodes) {
                      if (word.type === "word") {
                        if (word.value === "cover") {
                          result.warn(
                            "Gradient has outdated direction syntax. Replace `cover` to `farthest-corner`.",
                            { node: decl }
                          );
                        } else if (word.value === "contain") {
                          result.warn(
                            "Gradient has outdated direction syntax. Replace `contain` to `closest-side`.",
                            { node: decl }
                          );
                        }
                      }
                    }
                  }
                }
              }
            }
            if (value.includes("linear-gradient")) {
              if (OLD_LINEAR.test(value)) {
                result.warn(
                  "Gradient has outdated direction syntax. New syntax is like `to left` instead of `right`.",
                  { node: decl }
                );
              }
            }
          }
          if (SIZES.includes(decl.prop)) {
            if (!decl.value.includes("-fill-available")) {
              if (decl.value.includes("fill-available")) {
                result.warn(
                  "Replace fill-available to stretch, because spec had been changed",
                  { node: decl }
                );
              } else if (decl.value.includes("fill")) {
                let ast = parser(value);
                if (ast.nodes.some((i) => i.type === "word" && i.value === "fill")) {
                  result.warn(
                    "Replace fill to stretch, because spec had been changed",
                    { node: decl }
                  );
                }
              }
            }
          }
          let prefixer;
          if (decl.prop === "transition" || decl.prop === "transition-property") {
            return this.prefixes.transition.add(decl, result);
          } else if (decl.prop === "align-self") {
            let display = this.displayType(decl);
            if (display !== "grid" && this.prefixes.options.flexbox !== false) {
              prefixer = this.prefixes.add["align-self"];
              if (prefixer && prefixer.prefixes) {
                prefixer.process(decl);
              }
            }
            if (this.gridStatus(decl, result) !== false) {
              prefixer = this.prefixes.add["grid-row-align"];
              if (prefixer && prefixer.prefixes) {
                return prefixer.process(decl, result);
              }
            }
          } else if (decl.prop === "justify-self") {
            if (this.gridStatus(decl, result) !== false) {
              prefixer = this.prefixes.add["grid-column-align"];
              if (prefixer && prefixer.prefixes) {
                return prefixer.process(decl, result);
              }
            }
          } else if (decl.prop === "place-self") {
            prefixer = this.prefixes.add["place-self"];
            if (prefixer && prefixer.prefixes && this.gridStatus(decl, result) !== false) {
              return prefixer.process(decl, result);
            }
          } else {
            prefixer = this.prefixes.add[decl.prop];
            if (prefixer && prefixer.prefixes) {
              return prefixer.process(decl, result);
            }
          }
          return void 0;
        });
        if (this.gridStatus(css, result)) {
          insertAreas(css, this.disabled);
        }
        return css.walkDecls((decl) => {
          if (this.disabledValue(decl, result))
            return;
          let unprefixed = this.prefixes.unprefixed(decl.prop);
          let list = this.prefixes.values("add", unprefixed);
          if (Array.isArray(list)) {
            for (let value of list) {
              if (value.process)
                value.process(decl, result);
            }
          }
          Value.save(this.prefixes, decl);
        });
      }
      remove(css, result) {
        let resolution = this.prefixes.remove["@resolution"];
        css.walkAtRules((rule, i) => {
          if (this.prefixes.remove[`@${rule.name}`]) {
            if (!this.disabled(rule, result)) {
              rule.parent.removeChild(i);
            }
          } else if (rule.name === "media" && rule.params.includes("-resolution") && resolution) {
            resolution.clean(rule);
          }
        });
        for (let checker of this.prefixes.remove.selectors) {
          css.walkRules((rule, i) => {
            if (checker.check(rule)) {
              if (!this.disabled(rule, result)) {
                rule.parent.removeChild(i);
              }
            }
          });
        }
        return css.walkDecls((decl, i) => {
          if (this.disabled(decl, result))
            return;
          let rule = decl.parent;
          let unprefixed = this.prefixes.unprefixed(decl.prop);
          if (decl.prop === "transition" || decl.prop === "transition-property") {
            this.prefixes.transition.remove(decl);
          }
          if (this.prefixes.remove[decl.prop] && this.prefixes.remove[decl.prop].remove) {
            let notHack = this.prefixes.group(decl).down((other) => {
              return this.prefixes.normalize(other.prop) === unprefixed;
            });
            if (unprefixed === "flex-flow") {
              notHack = true;
            }
            if (decl.prop === "-webkit-box-orient") {
              let hacks = { "flex-direction": true, "flex-flow": true };
              if (!decl.parent.some((j) => hacks[j.prop]))
                return;
            }
            if (notHack && !this.withHackValue(decl)) {
              if (decl.raw("before").includes("\n")) {
                this.reduceSpaces(decl);
              }
              rule.removeChild(i);
              return;
            }
          }
          for (let checker of this.prefixes.values("remove", unprefixed)) {
            if (!checker.check)
              continue;
            if (!checker.check(decl.value))
              continue;
            unprefixed = checker.unprefixed;
            let notHack = this.prefixes.group(decl).down((other) => {
              return other.value.includes(unprefixed);
            });
            if (notHack) {
              rule.removeChild(i);
              return;
            }
          }
        });
      }
      withHackValue(decl) {
        return decl.prop === "-webkit-background-clip" && decl.value === "text";
      }
      disabledValue(node, result) {
        if (this.gridStatus(node, result) === false && node.type === "decl") {
          if (node.prop === "display" && node.value.includes("grid")) {
            return true;
          }
        }
        if (this.prefixes.options.flexbox === false && node.type === "decl") {
          if (node.prop === "display" && node.value.includes("flex")) {
            return true;
          }
        }
        if (node.type === "decl" && node.prop === "content") {
          return true;
        }
        return this.disabled(node, result);
      }
      disabledDecl(node, result) {
        if (this.gridStatus(node, result) === false && node.type === "decl") {
          if (node.prop.includes("grid") || node.prop === "justify-items") {
            return true;
          }
        }
        if (this.prefixes.options.flexbox === false && node.type === "decl") {
          let other = ["order", "justify-content", "align-items", "align-content"];
          if (node.prop.includes("flex") || other.includes(node.prop)) {
            return true;
          }
        }
        return this.disabled(node, result);
      }
      disabled(node, result) {
        if (!node)
          return false;
        if (node._autoprefixerDisabled !== void 0) {
          return node._autoprefixerDisabled;
        }
        if (node.parent) {
          let p = node.prev();
          if (p && p.type === "comment" && IGNORE_NEXT.test(p.text)) {
            node._autoprefixerDisabled = true;
            node._autoprefixerSelfDisabled = true;
            return true;
          }
        }
        let value = null;
        if (node.nodes) {
          let status;
          node.each((i) => {
            if (i.type !== "comment")
              return;
            if (/(!\s*)?autoprefixer:\s*(off|on)/i.test(i.text)) {
              if (typeof status !== "undefined") {
                result.warn(
                  "Second Autoprefixer control comment was ignored. Autoprefixer applies control comment to whole block, not to next rules.",
                  { node: i }
                );
              } else {
                status = /on/i.test(i.text);
              }
            }
          });
          if (status !== void 0) {
            value = !status;
          }
        }
        if (!node.nodes || value === null) {
          if (node.parent) {
            let isParentDisabled = this.disabled(node.parent, result);
            if (node.parent._autoprefixerSelfDisabled === true) {
              value = false;
            } else {
              value = isParentDisabled;
            }
          } else {
            value = false;
          }
        }
        node._autoprefixerDisabled = value;
        return value;
      }
      reduceSpaces(decl) {
        let stop = false;
        this.prefixes.group(decl).up(() => {
          stop = true;
          return true;
        });
        if (stop) {
          return;
        }
        let parts = decl.raw("before").split("\n");
        let prevMin = parts[parts.length - 1].length;
        let diff = false;
        this.prefixes.group(decl).down((other) => {
          parts = other.raw("before").split("\n");
          let last = parts.length - 1;
          if (parts[last].length > prevMin) {
            if (diff === false) {
              diff = parts[last].length - prevMin;
            }
            parts[last] = parts[last].slice(0, -diff);
            other.raws.before = parts.join("\n");
          }
        });
      }
      displayType(decl) {
        for (let i of decl.parent.nodes) {
          if (i.prop !== "display") {
            continue;
          }
          if (i.value.includes("flex")) {
            return "flex";
          }
          if (i.value.includes("grid")) {
            return "grid";
          }
        }
        return false;
      }
      gridStatus(node, result) {
        if (!node)
          return false;
        if (node._autoprefixerGridStatus !== void 0) {
          return node._autoprefixerGridStatus;
        }
        let value = null;
        if (node.nodes) {
          let status;
          node.each((i) => {
            if (i.type !== "comment")
              return;
            if (GRID_REGEX.test(i.text)) {
              let hasAutoplace = /:\s*autoplace/i.test(i.text);
              let noAutoplace = /no-autoplace/i.test(i.text);
              if (typeof status !== "undefined") {
                result.warn(
                  "Second Autoprefixer grid control comment was ignored. Autoprefixer applies control comments to the whole block, not to the next rules.",
                  { node: i }
                );
              } else if (hasAutoplace) {
                status = "autoplace";
              } else if (noAutoplace) {
                status = true;
              } else {
                status = /on/i.test(i.text);
              }
            }
          });
          if (status !== void 0) {
            value = status;
          }
        }
        if (node.type === "atrule" && node.name === "supports") {
          let params = node.params;
          if (params.includes("grid") && params.includes("auto")) {
            value = false;
          }
        }
        if (!node.nodes || value === null) {
          if (node.parent) {
            let isParentGrid = this.gridStatus(node.parent, result);
            if (node.parent._autoprefixerSelfDisabled === true) {
              value = false;
            } else {
              value = isParentGrid;
            }
          } else if (typeof this.prefixes.options.grid !== "undefined") {
            value = this.prefixes.options.grid;
          } else if (typeof process.env.AUTOPREFIXER_GRID !== "undefined") {
            if (process.env.AUTOPREFIXER_GRID === "autoplace") {
              value = "autoplace";
            } else {
              value = true;
            }
          } else {
            value = false;
          }
        }
        node._autoprefixerGridStatus = value;
        return value;
      }
    };
    module.exports = Processor;
  }
});

// node_modules/autoprefixer/lib/brackets.js
var require_brackets = __commonJS({
  "node_modules/autoprefixer/lib/brackets.js"(exports, module) {
    function last(array) {
      return array[array.length - 1];
    }
    var brackets = {
      parse(str) {
        let current = [""];
        let stack = [current];
        for (let sym of str) {
          if (sym === "(") {
            current = [""];
            last(stack).push(current);
            stack.push(current);
            continue;
          }
          if (sym === ")") {
            stack.pop();
            current = last(stack);
            current.push("");
            continue;
          }
          current[current.length - 1] += sym;
        }
        return stack[0];
      },
      stringify(ast) {
        let result = "";
        for (let i of ast) {
          if (typeof i === "object") {
            result += `(${brackets.stringify(i)})`;
            continue;
          }
          result += i;
        }
        return result;
      }
    };
    module.exports = brackets;
  }
});

// node_modules/autoprefixer/lib/supports.js
var require_supports = __commonJS({
  "node_modules/autoprefixer/lib/supports.js"(exports, module) {
    var featureQueries = require_css_featurequeries();
    var { feature } = require_unpacker();
    var { parse } = require_postcss();
    var Browsers = require_browsers();
    var brackets = require_brackets();
    var Value = require_value();
    var utils = require_utils();
    var data = feature(featureQueries);
    var supported = [];
    for (let browser in data.stats) {
      let versions = data.stats[browser];
      for (let version in versions) {
        let support = versions[version];
        if (/y/.test(support)) {
          supported.push(browser + " " + version);
        }
      }
    }
    var Supports = class {
      constructor(Prefixes, all) {
        this.Prefixes = Prefixes;
        this.all = all;
      }
      prefixer() {
        if (this.prefixerCache) {
          return this.prefixerCache;
        }
        let filtered = this.all.browsers.selected.filter((i) => {
          return supported.includes(i);
        });
        let browsers = new Browsers(
          this.all.browsers.data,
          filtered,
          this.all.options
        );
        this.prefixerCache = new this.Prefixes(
          this.all.data,
          browsers,
          this.all.options
        );
        return this.prefixerCache;
      }
      parse(str) {
        let parts = str.split(":");
        let prop = parts[0];
        let value = parts[1];
        if (!value)
          value = "";
        return [prop.trim(), value.trim()];
      }
      virtual(str) {
        let [prop, value] = this.parse(str);
        let rule = parse("a{}").first;
        rule.append({ prop, value, raws: { before: "" } });
        return rule;
      }
      prefixed(str) {
        let rule = this.virtual(str);
        if (this.disabled(rule.first)) {
          return rule.nodes;
        }
        let result = { warn: () => null };
        let prefixer = this.prefixer().add[rule.first.prop];
        prefixer && prefixer.process && prefixer.process(rule.first, result);
        for (let decl of rule.nodes) {
          for (let value of this.prefixer().values("add", rule.first.prop)) {
            value.process(decl);
          }
          Value.save(this.all, decl);
        }
        return rule.nodes;
      }
      isNot(node) {
        return typeof node === "string" && /not\s*/i.test(node);
      }
      isOr(node) {
        return typeof node === "string" && /\s*or\s*/i.test(node);
      }
      isProp(node) {
        return typeof node === "object" && node.length === 1 && typeof node[0] === "string";
      }
      isHack(all, unprefixed) {
        let check = new RegExp(`(\\(|\\s)${utils.escapeRegexp(unprefixed)}:`);
        return !check.test(all);
      }
      toRemove(str, all) {
        let [prop, value] = this.parse(str);
        let unprefixed = this.all.unprefixed(prop);
        let cleaner = this.all.cleaner();
        if (cleaner.remove[prop] && cleaner.remove[prop].remove && !this.isHack(all, unprefixed)) {
          return true;
        }
        for (let checker of cleaner.values("remove", unprefixed)) {
          if (checker.check(value)) {
            return true;
          }
        }
        return false;
      }
      remove(nodes, all) {
        let i = 0;
        while (i < nodes.length) {
          if (!this.isNot(nodes[i - 1]) && this.isProp(nodes[i]) && this.isOr(nodes[i + 1])) {
            if (this.toRemove(nodes[i][0], all)) {
              nodes.splice(i, 2);
              continue;
            }
            i += 2;
            continue;
          }
          if (typeof nodes[i] === "object") {
            nodes[i] = this.remove(nodes[i], all);
          }
          i += 1;
        }
        return nodes;
      }
      cleanBrackets(nodes) {
        return nodes.map((i) => {
          if (typeof i !== "object") {
            return i;
          }
          if (i.length === 1 && typeof i[0] === "object") {
            return this.cleanBrackets(i[0]);
          }
          return this.cleanBrackets(i);
        });
      }
      convert(progress) {
        let result = [""];
        for (let i of progress) {
          result.push([`${i.prop}: ${i.value}`]);
          result.push(" or ");
        }
        result[result.length - 1] = "";
        return result;
      }
      normalize(nodes) {
        if (typeof nodes !== "object") {
          return nodes;
        }
        nodes = nodes.filter((i) => i !== "");
        if (typeof nodes[0] === "string") {
          let firstNode = nodes[0].trim();
          if (firstNode.includes(":") || firstNode === "selector" || firstNode === "not selector") {
            return [brackets.stringify(nodes)];
          }
        }
        return nodes.map((i) => this.normalize(i));
      }
      add(nodes, all) {
        return nodes.map((i) => {
          if (this.isProp(i)) {
            let prefixed = this.prefixed(i[0]);
            if (prefixed.length > 1) {
              return this.convert(prefixed);
            }
            return i;
          }
          if (typeof i === "object") {
            return this.add(i, all);
          }
          return i;
        });
      }
      process(rule) {
        let ast = brackets.parse(rule.params);
        ast = this.normalize(ast);
        ast = this.remove(ast, rule.params);
        ast = this.add(ast, rule.params);
        ast = this.cleanBrackets(ast);
        rule.params = brackets.stringify(ast);
      }
      disabled(node) {
        if (!this.all.options.grid) {
          if (node.prop === "display" && node.value.includes("grid")) {
            return true;
          }
          if (node.prop.includes("grid") || node.prop === "justify-items") {
            return true;
          }
        }
        if (this.all.options.flexbox === false) {
          if (node.prop === "display" && node.value.includes("flex")) {
            return true;
          }
          let other = ["order", "justify-content", "align-items", "align-content"];
          if (node.prop.includes("flex") || other.includes(node.prop)) {
            return true;
          }
        }
        return false;
      }
    };
    module.exports = Supports;
  }
});

// node_modules/autoprefixer/lib/old-selector.js
var require_old_selector = __commonJS({
  "node_modules/autoprefixer/lib/old-selector.js"(exports, module) {
    var OldSelector = class {
      constructor(selector, prefix) {
        this.prefix = prefix;
        this.prefixed = selector.prefixed(this.prefix);
        this.regexp = selector.regexp(this.prefix);
        this.prefixeds = selector.possible().map((x) => [selector.prefixed(x), selector.regexp(x)]);
        this.unprefixed = selector.name;
        this.nameRegexp = selector.regexp();
      }
      isHack(rule) {
        let index = rule.parent.index(rule) + 1;
        let rules = rule.parent.nodes;
        while (index < rules.length) {
          let before = rules[index].selector;
          if (!before) {
            return true;
          }
          if (before.includes(this.unprefixed) && before.match(this.nameRegexp)) {
            return false;
          }
          let some = false;
          for (let [string, regexp] of this.prefixeds) {
            if (before.includes(string) && before.match(regexp)) {
              some = true;
              break;
            }
          }
          if (!some) {
            return true;
          }
          index += 1;
        }
        return true;
      }
      check(rule) {
        if (!rule.selector.includes(this.prefixed)) {
          return false;
        }
        if (!rule.selector.match(this.regexp)) {
          return false;
        }
        if (this.isHack(rule)) {
          return false;
        }
        return true;
      }
    };
    module.exports = OldSelector;
  }
});

// node_modules/autoprefixer/lib/selector.js
var require_selector = __commonJS({
  "node_modules/autoprefixer/lib/selector.js"(exports, module) {
    var { list } = require_postcss();
    var OldSelector = require_old_selector();
    var Prefixer = require_prefixer();
    var Browsers = require_browsers();
    var utils = require_utils();
    var Selector = class extends Prefixer {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        this.regexpCache = /* @__PURE__ */ new Map();
      }
      check(rule) {
        if (rule.selector.includes(this.name)) {
          return !!rule.selector.match(this.regexp());
        }
        return false;
      }
      prefixed(prefix) {
        return this.name.replace(/^(\W*)/, `$1${prefix}`);
      }
      regexp(prefix) {
        if (!this.regexpCache.has(prefix)) {
          let name = prefix ? this.prefixed(prefix) : this.name;
          this.regexpCache.set(
            prefix,
            new RegExp(`(^|[^:"'=])${utils.escapeRegexp(name)}`, "gi")
          );
        }
        return this.regexpCache.get(prefix);
      }
      possible() {
        return Browsers.prefixes();
      }
      prefixeds(rule) {
        if (rule._autoprefixerPrefixeds) {
          if (rule._autoprefixerPrefixeds[this.name]) {
            return rule._autoprefixerPrefixeds;
          }
        } else {
          rule._autoprefixerPrefixeds = {};
        }
        let prefixeds = {};
        if (rule.selector.includes(",")) {
          let ruleParts = list.comma(rule.selector);
          let toProcess = ruleParts.filter((el) => el.includes(this.name));
          for (let prefix of this.possible()) {
            prefixeds[prefix] = toProcess.map((el) => this.replace(el, prefix)).join(", ");
          }
        } else {
          for (let prefix of this.possible()) {
            prefixeds[prefix] = this.replace(rule.selector, prefix);
          }
        }
        rule._autoprefixerPrefixeds[this.name] = prefixeds;
        return rule._autoprefixerPrefixeds;
      }
      already(rule, prefixeds, prefix) {
        let index = rule.parent.index(rule) - 1;
        while (index >= 0) {
          let before = rule.parent.nodes[index];
          if (before.type !== "rule") {
            return false;
          }
          let some = false;
          for (let key in prefixeds[this.name]) {
            let prefixed = prefixeds[this.name][key];
            if (before.selector === prefixed) {
              if (prefix === key) {
                return true;
              } else {
                some = true;
                break;
              }
            }
          }
          if (!some) {
            return false;
          }
          index -= 1;
        }
        return false;
      }
      replace(selector, prefix) {
        return selector.replace(this.regexp(), `$1${this.prefixed(prefix)}`);
      }
      add(rule, prefix) {
        let prefixeds = this.prefixeds(rule);
        if (this.already(rule, prefixeds, prefix)) {
          return;
        }
        let cloned = this.clone(rule, { selector: prefixeds[this.name][prefix] });
        rule.parent.insertBefore(rule, cloned);
      }
      old(prefix) {
        return new OldSelector(this, prefix);
      }
    };
    module.exports = Selector;
  }
});

// node_modules/autoprefixer/lib/at-rule.js
var require_at_rule = __commonJS({
  "node_modules/autoprefixer/lib/at-rule.js"(exports, module) {
    var Prefixer = require_prefixer();
    var AtRule = class extends Prefixer {
      add(rule, prefix) {
        let prefixed = prefix + rule.name;
        let already = rule.parent.some(
          (i) => i.name === prefixed && i.params === rule.params
        );
        if (already) {
          return void 0;
        }
        let cloned = this.clone(rule, { name: prefixed });
        return rule.parent.insertBefore(rule, cloned);
      }
      process(node) {
        let parent = this.parentPrefix(node);
        for (let prefix of this.prefixes) {
          if (!parent || parent === prefix) {
            this.add(node, prefix);
          }
        }
      }
    };
    module.exports = AtRule;
  }
});

// node_modules/autoprefixer/lib/hacks/fullscreen.js
var require_fullscreen2 = __commonJS({
  "node_modules/autoprefixer/lib/hacks/fullscreen.js"(exports, module) {
    var Selector = require_selector();
    var Fullscreen = class extends Selector {
      prefixed(prefix) {
        if (prefix === "-webkit-") {
          return ":-webkit-full-screen";
        }
        if (prefix === "-moz-") {
          return ":-moz-full-screen";
        }
        return `:${prefix}fullscreen`;
      }
    };
    Fullscreen.names = [":fullscreen"];
    module.exports = Fullscreen;
  }
});

// node_modules/autoprefixer/lib/hacks/placeholder.js
var require_placeholder = __commonJS({
  "node_modules/autoprefixer/lib/hacks/placeholder.js"(exports, module) {
    var Selector = require_selector();
    var Placeholder = class extends Selector {
      possible() {
        return super.possible().concat(["-moz- old", "-ms- old"]);
      }
      prefixed(prefix) {
        if (prefix === "-webkit-") {
          return "::-webkit-input-placeholder";
        }
        if (prefix === "-ms-") {
          return "::-ms-input-placeholder";
        }
        if (prefix === "-ms- old") {
          return ":-ms-input-placeholder";
        }
        if (prefix === "-moz- old") {
          return ":-moz-placeholder";
        }
        return `::${prefix}placeholder`;
      }
    };
    Placeholder.names = ["::placeholder"];
    module.exports = Placeholder;
  }
});

// node_modules/autoprefixer/lib/hacks/placeholder-shown.js
var require_placeholder_shown = __commonJS({
  "node_modules/autoprefixer/lib/hacks/placeholder-shown.js"(exports, module) {
    var Selector = require_selector();
    var PlaceholderShown = class extends Selector {
      prefixed(prefix) {
        if (prefix === "-ms-") {
          return ":-ms-input-placeholder";
        }
        return `:${prefix}placeholder-shown`;
      }
    };
    PlaceholderShown.names = [":placeholder-shown"];
    module.exports = PlaceholderShown;
  }
});

// node_modules/autoprefixer/lib/hacks/file-selector-button.js
var require_file_selector_button = __commonJS({
  "node_modules/autoprefixer/lib/hacks/file-selector-button.js"(exports, module) {
    var Selector = require_selector();
    var utils = require_utils();
    var FileSelectorButton = class extends Selector {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        if (this.prefixes) {
          this.prefixes = utils.uniq(this.prefixes.map(() => "-webkit-"));
        }
      }
      prefixed(prefix) {
        if (prefix === "-webkit-") {
          return "::-webkit-file-upload-button";
        }
        return `::${prefix}file-selector-button`;
      }
    };
    FileSelectorButton.names = ["::file-selector-button"];
    module.exports = FileSelectorButton;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-spec.js
var require_flex_spec = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-spec.js"(exports, module) {
    module.exports = function(prefix) {
      let spec;
      if (prefix === "-webkit- 2009" || prefix === "-moz-") {
        spec = 2009;
      } else if (prefix === "-ms-") {
        spec = 2012;
      } else if (prefix === "-webkit-") {
        spec = "final";
      }
      if (prefix === "-webkit- 2009") {
        prefix = "-webkit-";
      }
      return [spec, prefix];
    };
  }
});

// node_modules/autoprefixer/lib/hacks/flex.js
var require_flex = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex.js"(exports, module) {
    var list = require_postcss().list;
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var Flex = class extends Declaration {
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return prefix + "box-flex";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "flex";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2009) {
          decl.value = list.space(decl.value)[0];
          decl.value = Flex.oldValues[decl.value] || decl.value;
          return super.set(decl, prefix);
        }
        if (spec === 2012) {
          let components = list.space(decl.value);
          if (components.length === 3 && components[2] === "0") {
            decl.value = components.slice(0, 2).concat("0px").join(" ");
          }
        }
        return super.set(decl, prefix);
      }
    };
    Flex.names = ["flex", "box-flex"];
    Flex.oldValues = {
      auto: "1",
      none: "0"
    };
    module.exports = Flex;
  }
});

// node_modules/autoprefixer/lib/hacks/order.js
var require_order = __commonJS({
  "node_modules/autoprefixer/lib/hacks/order.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var Order = class extends Declaration {
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return prefix + "box-ordinal-group";
        }
        if (spec === 2012) {
          return prefix + "flex-order";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "order";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2009 && /\d/.test(decl.value)) {
          decl.value = (parseInt(decl.value) + 1).toString();
          return super.set(decl, prefix);
        }
        return super.set(decl, prefix);
      }
    };
    Order.names = ["order", "flex-order", "box-ordinal-group"];
    module.exports = Order;
  }
});

// node_modules/autoprefixer/lib/hacks/filter.js
var require_filter = __commonJS({
  "node_modules/autoprefixer/lib/hacks/filter.js"(exports, module) {
    var Declaration = require_declaration();
    var Filter = class extends Declaration {
      check(decl) {
        let v = decl.value;
        return !v.toLowerCase().includes("alpha(") && !v.includes("DXImageTransform.Microsoft") && !v.includes("data:image/svg+xml");
      }
    };
    Filter.names = ["filter"];
    module.exports = Filter;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-end.js
var require_grid_end = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-end.js"(exports, module) {
    var Declaration = require_declaration();
    var { isPureNumber } = require_utils();
    var GridEnd = class extends Declaration {
      insert(decl, prefix, prefixes, result) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        let clonedDecl = this.clone(decl);
        let startProp = decl.prop.replace(/end$/, "start");
        let spanProp = prefix + decl.prop.replace(/end$/, "span");
        if (decl.parent.some((i) => i.prop === spanProp)) {
          return void 0;
        }
        clonedDecl.prop = spanProp;
        if (decl.value.includes("span")) {
          clonedDecl.value = decl.value.replace(/span\s/i, "");
        } else {
          let startDecl;
          decl.parent.walkDecls(startProp, (d) => {
            startDecl = d;
          });
          if (startDecl) {
            if (isPureNumber(startDecl.value)) {
              let value = Number(decl.value) - Number(startDecl.value) + "";
              clonedDecl.value = value;
            } else {
              return void 0;
            }
          } else {
            decl.warn(
              result,
              `Can not prefix ${decl.prop} (${startProp} is not found)`
            );
          }
        }
        decl.cloneBefore(clonedDecl);
        return void 0;
      }
    };
    GridEnd.names = ["grid-row-end", "grid-column-end"];
    module.exports = GridEnd;
  }
});

// node_modules/autoprefixer/lib/hacks/animation.js
var require_animation = __commonJS({
  "node_modules/autoprefixer/lib/hacks/animation.js"(exports, module) {
    var Declaration = require_declaration();
    var Animation = class extends Declaration {
      check(decl) {
        return !decl.value.split(/\s+/).some((i) => {
          let lower = i.toLowerCase();
          return lower === "reverse" || lower === "alternate-reverse";
        });
      }
    };
    Animation.names = ["animation", "animation-direction"];
    module.exports = Animation;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-flow.js
var require_flex_flow = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-flow.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var FlexFlow = class extends Declaration {
      insert(decl, prefix, prefixes) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec !== 2009) {
          return super.insert(decl, prefix, prefixes);
        }
        let values = decl.value.split(/\s+/).filter((i) => i !== "wrap" && i !== "nowrap" && "wrap-reverse");
        if (values.length === 0) {
          return void 0;
        }
        let already = decl.parent.some(
          (i) => i.prop === prefix + "box-orient" || i.prop === prefix + "box-direction"
        );
        if (already) {
          return void 0;
        }
        let value = values[0];
        let orient = value.includes("row") ? "horizontal" : "vertical";
        let dir = value.includes("reverse") ? "reverse" : "normal";
        let cloned = this.clone(decl);
        cloned.prop = prefix + "box-orient";
        cloned.value = orient;
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        decl.parent.insertBefore(decl, cloned);
        cloned = this.clone(decl);
        cloned.prop = prefix + "box-direction";
        cloned.value = dir;
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        return decl.parent.insertBefore(decl, cloned);
      }
    };
    FlexFlow.names = ["flex-flow", "box-direction", "box-orient"];
    module.exports = FlexFlow;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-grow.js
var require_flex_grow = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-grow.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var Flex = class extends Declaration {
      normalize() {
        return "flex";
      }
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return prefix + "box-flex";
        }
        if (spec === 2012) {
          return prefix + "flex-positive";
        }
        return super.prefixed(prop, prefix);
      }
    };
    Flex.names = ["flex-grow", "flex-positive"];
    module.exports = Flex;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-wrap.js
var require_flex_wrap = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-wrap.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var FlexWrap = class extends Declaration {
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec !== 2009) {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    FlexWrap.names = ["flex-wrap"];
    module.exports = FlexWrap;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-area.js
var require_grid_area = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-area.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_grid_utils();
    var GridArea = class extends Declaration {
      insert(decl, prefix, prefixes, result) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        let values = utils.parse(decl);
        let [rowStart, rowSpan] = utils.translate(values, 0, 2);
        let [columnStart, columnSpan] = utils.translate(values, 1, 3);
        [
          ["grid-row", rowStart],
          ["grid-row-span", rowSpan],
          ["grid-column", columnStart],
          ["grid-column-span", columnSpan]
        ].forEach(([prop, value]) => {
          utils.insertDecl(decl, prop, value);
        });
        utils.warnTemplateSelectorNotFound(decl, result);
        utils.warnIfGridRowColumnExists(decl, result);
        return void 0;
      }
    };
    GridArea.names = ["grid-area"];
    module.exports = GridArea;
  }
});

// node_modules/autoprefixer/lib/hacks/place-self.js
var require_place_self = __commonJS({
  "node_modules/autoprefixer/lib/hacks/place-self.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_grid_utils();
    var PlaceSelf = class extends Declaration {
      insert(decl, prefix, prefixes) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        if (decl.parent.some((i) => i.prop === "-ms-grid-row-align")) {
          return void 0;
        }
        let [[first, second]] = utils.parse(decl);
        if (second) {
          utils.insertDecl(decl, "grid-row-align", first);
          utils.insertDecl(decl, "grid-column-align", second);
        } else {
          utils.insertDecl(decl, "grid-row-align", first);
          utils.insertDecl(decl, "grid-column-align", first);
        }
        return void 0;
      }
    };
    PlaceSelf.names = ["place-self"];
    module.exports = PlaceSelf;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-start.js
var require_grid_start = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-start.js"(exports, module) {
    var Declaration = require_declaration();
    var GridStart = class extends Declaration {
      check(decl) {
        let value = decl.value;
        return !value.includes("/") && !value.includes("span");
      }
      normalize(prop) {
        return prop.replace("-start", "");
      }
      prefixed(prop, prefix) {
        let result = super.prefixed(prop, prefix);
        if (prefix === "-ms-") {
          result = result.replace("-start", "");
        }
        return result;
      }
    };
    GridStart.names = ["grid-row-start", "grid-column-start"];
    module.exports = GridStart;
  }
});

// node_modules/autoprefixer/lib/hacks/align-self.js
var require_align_self = __commonJS({
  "node_modules/autoprefixer/lib/hacks/align-self.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var AlignSelf = class extends Declaration {
      check(decl) {
        return decl.parent && !decl.parent.some((i) => {
          return i.prop && i.prop.startsWith("grid-");
        });
      }
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012) {
          return prefix + "flex-item-align";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "align-self";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2012) {
          decl.value = AlignSelf.oldValues[decl.value] || decl.value;
          return super.set(decl, prefix);
        }
        if (spec === "final") {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    AlignSelf.names = ["align-self", "flex-item-align"];
    AlignSelf.oldValues = {
      "flex-end": "end",
      "flex-start": "start"
    };
    module.exports = AlignSelf;
  }
});

// node_modules/autoprefixer/lib/hacks/appearance.js
var require_appearance = __commonJS({
  "node_modules/autoprefixer/lib/hacks/appearance.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_utils();
    var Appearance = class extends Declaration {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        if (this.prefixes) {
          this.prefixes = utils.uniq(
            this.prefixes.map((i) => {
              if (i === "-ms-") {
                return "-webkit-";
              }
              return i;
            })
          );
        }
      }
    };
    Appearance.names = ["appearance"];
    module.exports = Appearance;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-basis.js
var require_flex_basis = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-basis.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var FlexBasis = class extends Declaration {
      normalize() {
        return "flex-basis";
      }
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012) {
          return prefix + "flex-preferred-size";
        }
        return super.prefixed(prop, prefix);
      }
      set(decl, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012 || spec === "final") {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    FlexBasis.names = ["flex-basis", "flex-preferred-size"];
    module.exports = FlexBasis;
  }
});

// node_modules/autoprefixer/lib/hacks/mask-border.js
var require_mask_border = __commonJS({
  "node_modules/autoprefixer/lib/hacks/mask-border.js"(exports, module) {
    var Declaration = require_declaration();
    var MaskBorder = class extends Declaration {
      normalize() {
        return this.name.replace("box-image", "border");
      }
      prefixed(prop, prefix) {
        let result = super.prefixed(prop, prefix);
        if (prefix === "-webkit-") {
          result = result.replace("border", "box-image");
        }
        return result;
      }
    };
    MaskBorder.names = [
      "mask-border",
      "mask-border-source",
      "mask-border-slice",
      "mask-border-width",
      "mask-border-outset",
      "mask-border-repeat",
      "mask-box-image",
      "mask-box-image-source",
      "mask-box-image-slice",
      "mask-box-image-width",
      "mask-box-image-outset",
      "mask-box-image-repeat"
    ];
    module.exports = MaskBorder;
  }
});

// node_modules/autoprefixer/lib/hacks/mask-composite.js
var require_mask_composite = __commonJS({
  "node_modules/autoprefixer/lib/hacks/mask-composite.js"(exports, module) {
    var Declaration = require_declaration();
    var MaskComposite = class extends Declaration {
      insert(decl, prefix, prefixes) {
        let isCompositeProp = decl.prop === "mask-composite";
        let compositeValues;
        if (isCompositeProp) {
          compositeValues = decl.value.split(",");
        } else {
          compositeValues = decl.value.match(MaskComposite.regexp) || [];
        }
        compositeValues = compositeValues.map((el) => el.trim()).filter((el) => el);
        let hasCompositeValues = compositeValues.length;
        let compositeDecl;
        if (hasCompositeValues) {
          compositeDecl = this.clone(decl);
          compositeDecl.value = compositeValues.map((value) => MaskComposite.oldValues[value] || value).join(", ");
          if (compositeValues.includes("intersect")) {
            compositeDecl.value += ", xor";
          }
          compositeDecl.prop = prefix + "mask-composite";
        }
        if (isCompositeProp) {
          if (!hasCompositeValues) {
            return void 0;
          }
          if (this.needCascade(decl)) {
            compositeDecl.raws.before = this.calcBefore(prefixes, decl, prefix);
          }
          return decl.parent.insertBefore(decl, compositeDecl);
        }
        let cloned = this.clone(decl);
        cloned.prop = prefix + cloned.prop;
        if (hasCompositeValues) {
          cloned.value = cloned.value.replace(MaskComposite.regexp, "");
        }
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        decl.parent.insertBefore(decl, cloned);
        if (!hasCompositeValues) {
          return decl;
        }
        if (this.needCascade(decl)) {
          compositeDecl.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        return decl.parent.insertBefore(decl, compositeDecl);
      }
    };
    MaskComposite.names = ["mask", "mask-composite"];
    MaskComposite.oldValues = {
      add: "source-over",
      subtract: "source-out",
      intersect: "source-in",
      exclude: "xor"
    };
    MaskComposite.regexp = new RegExp(
      `\\s+(${Object.keys(MaskComposite.oldValues).join(
        "|"
      )})\\b(?!\\))\\s*(?=[,])`,
      "ig"
    );
    module.exports = MaskComposite;
  }
});

// node_modules/autoprefixer/lib/hacks/align-items.js
var require_align_items = __commonJS({
  "node_modules/autoprefixer/lib/hacks/align-items.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var AlignItems = class extends Declaration {
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return prefix + "box-align";
        }
        if (spec === 2012) {
          return prefix + "flex-align";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "align-items";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2009 || spec === 2012) {
          decl.value = AlignItems.oldValues[decl.value] || decl.value;
        }
        return super.set(decl, prefix);
      }
    };
    AlignItems.names = ["align-items", "flex-align", "box-align"];
    AlignItems.oldValues = {
      "flex-end": "end",
      "flex-start": "start"
    };
    module.exports = AlignItems;
  }
});

// node_modules/autoprefixer/lib/hacks/user-select.js
var require_user_select = __commonJS({
  "node_modules/autoprefixer/lib/hacks/user-select.js"(exports, module) {
    var Declaration = require_declaration();
    var UserSelect = class extends Declaration {
      set(decl, prefix) {
        if (prefix === "-ms-" && decl.value === "contain") {
          decl.value = "element";
        }
        return super.set(decl, prefix);
      }
      insert(decl, prefix, prefixes) {
        if (decl.value === "all" && prefix === "-ms-") {
          return void 0;
        } else {
          return super.insert(decl, prefix, prefixes);
        }
      }
    };
    UserSelect.names = ["user-select"];
    module.exports = UserSelect;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-shrink.js
var require_flex_shrink = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-shrink.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var FlexShrink = class extends Declaration {
      normalize() {
        return "flex-shrink";
      }
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012) {
          return prefix + "flex-negative";
        }
        return super.prefixed(prop, prefix);
      }
      set(decl, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012 || spec === "final") {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    FlexShrink.names = ["flex-shrink", "flex-negative"];
    module.exports = FlexShrink;
  }
});

// node_modules/autoprefixer/lib/hacks/break-props.js
var require_break_props = __commonJS({
  "node_modules/autoprefixer/lib/hacks/break-props.js"(exports, module) {
    var Declaration = require_declaration();
    var BreakProps = class extends Declaration {
      prefixed(prop, prefix) {
        return `${prefix}column-${prop}`;
      }
      normalize(prop) {
        if (prop.includes("inside")) {
          return "break-inside";
        }
        if (prop.includes("before")) {
          return "break-before";
        }
        return "break-after";
      }
      set(decl, prefix) {
        if (decl.prop === "break-inside" && decl.value === "avoid-column" || decl.value === "avoid-page") {
          decl.value = "avoid";
        }
        return super.set(decl, prefix);
      }
      insert(decl, prefix, prefixes) {
        if (decl.prop !== "break-inside") {
          return super.insert(decl, prefix, prefixes);
        }
        if (/region/i.test(decl.value) || /page/i.test(decl.value)) {
          return void 0;
        }
        return super.insert(decl, prefix, prefixes);
      }
    };
    BreakProps.names = [
      "break-inside",
      "page-break-inside",
      "column-break-inside",
      "break-before",
      "page-break-before",
      "column-break-before",
      "break-after",
      "page-break-after",
      "column-break-after"
    ];
    module.exports = BreakProps;
  }
});

// node_modules/autoprefixer/lib/hacks/writing-mode.js
var require_writing_mode = __commonJS({
  "node_modules/autoprefixer/lib/hacks/writing-mode.js"(exports, module) {
    var Declaration = require_declaration();
    var WritingMode = class extends Declaration {
      insert(decl, prefix, prefixes) {
        if (prefix === "-ms-") {
          let cloned = this.set(this.clone(decl), prefix);
          if (this.needCascade(decl)) {
            cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
          }
          let direction = "ltr";
          decl.parent.nodes.forEach((i) => {
            if (i.prop === "direction") {
              if (i.value === "rtl" || i.value === "ltr")
                direction = i.value;
            }
          });
          cloned.value = WritingMode.msValues[direction][decl.value] || decl.value;
          return decl.parent.insertBefore(decl, cloned);
        }
        return super.insert(decl, prefix, prefixes);
      }
    };
    WritingMode.names = ["writing-mode"];
    WritingMode.msValues = {
      ltr: {
        "horizontal-tb": "lr-tb",
        "vertical-rl": "tb-rl",
        "vertical-lr": "tb-lr"
      },
      rtl: {
        "horizontal-tb": "rl-tb",
        "vertical-rl": "bt-rl",
        "vertical-lr": "bt-lr"
      }
    };
    module.exports = WritingMode;
  }
});

// node_modules/autoprefixer/lib/hacks/border-image.js
var require_border_image2 = __commonJS({
  "node_modules/autoprefixer/lib/hacks/border-image.js"(exports, module) {
    var Declaration = require_declaration();
    var BorderImage = class extends Declaration {
      set(decl, prefix) {
        decl.value = decl.value.replace(/\s+fill(\s)/, "$1");
        return super.set(decl, prefix);
      }
    };
    BorderImage.names = ["border-image"];
    module.exports = BorderImage;
  }
});

// node_modules/autoprefixer/lib/hacks/align-content.js
var require_align_content = __commonJS({
  "node_modules/autoprefixer/lib/hacks/align-content.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var AlignContent = class extends Declaration {
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2012) {
          return prefix + "flex-line-pack";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "align-content";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2012) {
          decl.value = AlignContent.oldValues[decl.value] || decl.value;
          return super.set(decl, prefix);
        }
        if (spec === "final") {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    AlignContent.names = ["align-content", "flex-line-pack"];
    AlignContent.oldValues = {
      "flex-end": "end",
      "flex-start": "start",
      "space-between": "justify",
      "space-around": "distribute"
    };
    module.exports = AlignContent;
  }
});

// node_modules/autoprefixer/lib/hacks/border-radius.js
var require_border_radius2 = __commonJS({
  "node_modules/autoprefixer/lib/hacks/border-radius.js"(exports, module) {
    var Declaration = require_declaration();
    var BorderRadius = class extends Declaration {
      prefixed(prop, prefix) {
        if (prefix === "-moz-") {
          return prefix + (BorderRadius.toMozilla[prop] || prop);
        }
        return super.prefixed(prop, prefix);
      }
      normalize(prop) {
        return BorderRadius.toNormal[prop] || prop;
      }
    };
    BorderRadius.names = ["border-radius"];
    BorderRadius.toMozilla = {};
    BorderRadius.toNormal = {};
    for (let ver of ["top", "bottom"]) {
      for (let hor of ["left", "right"]) {
        let normal = `border-${ver}-${hor}-radius`;
        let mozilla = `border-radius-${ver}${hor}`;
        BorderRadius.names.push(normal);
        BorderRadius.names.push(mozilla);
        BorderRadius.toMozilla[normal] = mozilla;
        BorderRadius.toNormal[mozilla] = normal;
      }
    }
    module.exports = BorderRadius;
  }
});

// node_modules/autoprefixer/lib/hacks/block-logical.js
var require_block_logical = __commonJS({
  "node_modules/autoprefixer/lib/hacks/block-logical.js"(exports, module) {
    var Declaration = require_declaration();
    var BlockLogical = class extends Declaration {
      prefixed(prop, prefix) {
        if (prop.includes("-start")) {
          return prefix + prop.replace("-block-start", "-before");
        }
        return prefix + prop.replace("-block-end", "-after");
      }
      normalize(prop) {
        if (prop.includes("-before")) {
          return prop.replace("-before", "-block-start");
        }
        return prop.replace("-after", "-block-end");
      }
    };
    BlockLogical.names = [
      "border-block-start",
      "border-block-end",
      "margin-block-start",
      "margin-block-end",
      "padding-block-start",
      "padding-block-end",
      "border-before",
      "border-after",
      "margin-before",
      "margin-after",
      "padding-before",
      "padding-after"
    ];
    module.exports = BlockLogical;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-template.js
var require_grid_template = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-template.js"(exports, module) {
    var Declaration = require_declaration();
    var {
      parseTemplate,
      warnMissedAreas,
      getGridGap,
      warnGridGap,
      inheritGridGap
    } = require_grid_utils();
    var GridTemplate = class extends Declaration {
      insert(decl, prefix, prefixes, result) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        if (decl.parent.some((i) => i.prop === "-ms-grid-rows")) {
          return void 0;
        }
        let gap = getGridGap(decl);
        let inheritedGap = inheritGridGap(decl, gap);
        let { rows, columns, areas } = parseTemplate({
          decl,
          gap: inheritedGap || gap
        });
        let hasAreas = Object.keys(areas).length > 0;
        let hasRows = Boolean(rows);
        let hasColumns = Boolean(columns);
        warnGridGap({
          gap,
          hasColumns,
          decl,
          result
        });
        warnMissedAreas(areas, decl, result);
        if (hasRows && hasColumns || hasAreas) {
          decl.cloneBefore({
            prop: "-ms-grid-rows",
            value: rows,
            raws: {}
          });
        }
        if (hasColumns) {
          decl.cloneBefore({
            prop: "-ms-grid-columns",
            value: columns,
            raws: {}
          });
        }
        return decl;
      }
    };
    GridTemplate.names = ["grid-template"];
    module.exports = GridTemplate;
  }
});

// node_modules/autoprefixer/lib/hacks/inline-logical.js
var require_inline_logical = __commonJS({
  "node_modules/autoprefixer/lib/hacks/inline-logical.js"(exports, module) {
    var Declaration = require_declaration();
    var InlineLogical = class extends Declaration {
      prefixed(prop, prefix) {
        return prefix + prop.replace("-inline", "");
      }
      normalize(prop) {
        return prop.replace(/(margin|padding|border)-(start|end)/, "$1-inline-$2");
      }
    };
    InlineLogical.names = [
      "border-inline-start",
      "border-inline-end",
      "margin-inline-start",
      "margin-inline-end",
      "padding-inline-start",
      "padding-inline-end",
      "border-start",
      "border-end",
      "margin-start",
      "margin-end",
      "padding-start",
      "padding-end"
    ];
    module.exports = InlineLogical;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-row-align.js
var require_grid_row_align = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-row-align.js"(exports, module) {
    var Declaration = require_declaration();
    var GridRowAlign = class extends Declaration {
      check(decl) {
        return !decl.value.includes("flex-") && decl.value !== "baseline";
      }
      prefixed(prop, prefix) {
        return prefix + "grid-row-align";
      }
      normalize() {
        return "align-self";
      }
    };
    GridRowAlign.names = ["grid-row-align"];
    module.exports = GridRowAlign;
  }
});

// node_modules/autoprefixer/lib/hacks/transform-decl.js
var require_transform_decl = __commonJS({
  "node_modules/autoprefixer/lib/hacks/transform-decl.js"(exports, module) {
    var Declaration = require_declaration();
    var TransformDecl = class extends Declaration {
      keyframeParents(decl) {
        let { parent } = decl;
        while (parent) {
          if (parent.type === "atrule" && parent.name === "keyframes") {
            return true;
          }
          ;
          ({ parent } = parent);
        }
        return false;
      }
      contain3d(decl) {
        if (decl.prop === "transform-origin") {
          return false;
        }
        for (let func of TransformDecl.functions3d) {
          if (decl.value.includes(`${func}(`)) {
            return true;
          }
        }
        return false;
      }
      set(decl, prefix) {
        decl = super.set(decl, prefix);
        if (prefix === "-ms-") {
          decl.value = decl.value.replace(/rotatez/gi, "rotate");
        }
        return decl;
      }
      insert(decl, prefix, prefixes) {
        if (prefix === "-ms-") {
          if (!this.contain3d(decl) && !this.keyframeParents(decl)) {
            return super.insert(decl, prefix, prefixes);
          }
        } else if (prefix === "-o-") {
          if (!this.contain3d(decl)) {
            return super.insert(decl, prefix, prefixes);
          }
        } else {
          return super.insert(decl, prefix, prefixes);
        }
        return void 0;
      }
    };
    TransformDecl.names = ["transform", "transform-origin"];
    TransformDecl.functions3d = [
      "matrix3d",
      "translate3d",
      "translateZ",
      "scale3d",
      "scaleZ",
      "rotate3d",
      "rotateX",
      "rotateY",
      "perspective"
    ];
    module.exports = TransformDecl;
  }
});

// node_modules/autoprefixer/lib/hacks/flex-direction.js
var require_flex_direction = __commonJS({
  "node_modules/autoprefixer/lib/hacks/flex-direction.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var FlexDirection = class extends Declaration {
      normalize() {
        return "flex-direction";
      }
      insert(decl, prefix, prefixes) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec !== 2009) {
          return super.insert(decl, prefix, prefixes);
        }
        let already = decl.parent.some(
          (i) => i.prop === prefix + "box-orient" || i.prop === prefix + "box-direction"
        );
        if (already) {
          return void 0;
        }
        let v = decl.value;
        let orient, dir;
        if (v === "inherit" || v === "initial" || v === "unset") {
          orient = v;
          dir = v;
        } else {
          orient = v.includes("row") ? "horizontal" : "vertical";
          dir = v.includes("reverse") ? "reverse" : "normal";
        }
        let cloned = this.clone(decl);
        cloned.prop = prefix + "box-orient";
        cloned.value = orient;
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        decl.parent.insertBefore(decl, cloned);
        cloned = this.clone(decl);
        cloned.prop = prefix + "box-direction";
        cloned.value = dir;
        if (this.needCascade(decl)) {
          cloned.raws.before = this.calcBefore(prefixes, decl, prefix);
        }
        return decl.parent.insertBefore(decl, cloned);
      }
      old(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return [prefix + "box-orient", prefix + "box-direction"];
        } else {
          return super.old(prop, prefix);
        }
      }
    };
    FlexDirection.names = ["flex-direction", "box-direction", "box-orient"];
    module.exports = FlexDirection;
  }
});

// node_modules/autoprefixer/lib/hacks/image-rendering.js
var require_image_rendering = __commonJS({
  "node_modules/autoprefixer/lib/hacks/image-rendering.js"(exports, module) {
    var Declaration = require_declaration();
    var ImageRendering = class extends Declaration {
      check(decl) {
        return decl.value === "pixelated";
      }
      prefixed(prop, prefix) {
        if (prefix === "-ms-") {
          return "-ms-interpolation-mode";
        }
        return super.prefixed(prop, prefix);
      }
      set(decl, prefix) {
        if (prefix !== "-ms-")
          return super.set(decl, prefix);
        decl.prop = "-ms-interpolation-mode";
        decl.value = "nearest-neighbor";
        return decl;
      }
      normalize() {
        return "image-rendering";
      }
      process(node, result) {
        return super.process(node, result);
      }
    };
    ImageRendering.names = ["image-rendering", "interpolation-mode"];
    module.exports = ImageRendering;
  }
});

// node_modules/autoprefixer/lib/hacks/backdrop-filter.js
var require_backdrop_filter = __commonJS({
  "node_modules/autoprefixer/lib/hacks/backdrop-filter.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_utils();
    var BackdropFilter = class extends Declaration {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        if (this.prefixes) {
          this.prefixes = utils.uniq(
            this.prefixes.map((i) => {
              return i === "-ms-" ? "-webkit-" : i;
            })
          );
        }
      }
    };
    BackdropFilter.names = ["backdrop-filter"];
    module.exports = BackdropFilter;
  }
});

// node_modules/autoprefixer/lib/hacks/background-clip.js
var require_background_clip = __commonJS({
  "node_modules/autoprefixer/lib/hacks/background-clip.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_utils();
    var BackgroundClip = class extends Declaration {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        if (this.prefixes) {
          this.prefixes = utils.uniq(
            this.prefixes.map((i) => {
              return i === "-ms-" ? "-webkit-" : i;
            })
          );
        }
      }
      check(decl) {
        return decl.value.toLowerCase() === "text";
      }
    };
    BackgroundClip.names = ["background-clip"];
    module.exports = BackgroundClip;
  }
});

// node_modules/autoprefixer/lib/hacks/text-decoration.js
var require_text_decoration2 = __commonJS({
  "node_modules/autoprefixer/lib/hacks/text-decoration.js"(exports, module) {
    var Declaration = require_declaration();
    var BASIC = [
      "none",
      "underline",
      "overline",
      "line-through",
      "blink",
      "inherit",
      "initial",
      "unset"
    ];
    var TextDecoration = class extends Declaration {
      check(decl) {
        return decl.value.split(/\s+/).some((i) => !BASIC.includes(i));
      }
    };
    TextDecoration.names = ["text-decoration"];
    module.exports = TextDecoration;
  }
});

// node_modules/autoprefixer/lib/hacks/justify-content.js
var require_justify_content = __commonJS({
  "node_modules/autoprefixer/lib/hacks/justify-content.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var Declaration = require_declaration();
    var JustifyContent = class extends Declaration {
      prefixed(prop, prefix) {
        let spec;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          return prefix + "box-pack";
        }
        if (spec === 2012) {
          return prefix + "flex-pack";
        }
        return super.prefixed(prop, prefix);
      }
      normalize() {
        return "justify-content";
      }
      set(decl, prefix) {
        let spec = flexSpec(prefix)[0];
        if (spec === 2009 || spec === 2012) {
          let value = JustifyContent.oldValues[decl.value] || decl.value;
          decl.value = value;
          if (spec !== 2009 || value !== "distribute") {
            return super.set(decl, prefix);
          }
        } else if (spec === "final") {
          return super.set(decl, prefix);
        }
        return void 0;
      }
    };
    JustifyContent.names = ["justify-content", "flex-pack", "box-pack"];
    JustifyContent.oldValues = {
      "flex-end": "end",
      "flex-start": "start",
      "space-between": "justify",
      "space-around": "distribute"
    };
    module.exports = JustifyContent;
  }
});

// node_modules/autoprefixer/lib/hacks/background-size.js
var require_background_size = __commonJS({
  "node_modules/autoprefixer/lib/hacks/background-size.js"(exports, module) {
    var Declaration = require_declaration();
    var BackgroundSize = class extends Declaration {
      set(decl, prefix) {
        let value = decl.value.toLowerCase();
        if (prefix === "-webkit-" && !value.includes(" ") && value !== "contain" && value !== "cover") {
          decl.value = decl.value + " " + decl.value;
        }
        return super.set(decl, prefix);
      }
    };
    BackgroundSize.names = ["background-size"];
    module.exports = BackgroundSize;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-row-column.js
var require_grid_row_column = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-row-column.js"(exports, module) {
    var Declaration = require_declaration();
    var utils = require_grid_utils();
    var GridRowColumn = class extends Declaration {
      insert(decl, prefix, prefixes) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        let values = utils.parse(decl);
        let [start, span] = utils.translate(values, 0, 1);
        let hasStartValueSpan = values[0] && values[0].includes("span");
        if (hasStartValueSpan) {
          span = values[0].join("").replace(/\D/g, "");
        }
        ;
        [
          [decl.prop, start],
          [`${decl.prop}-span`, span]
        ].forEach(([prop, value]) => {
          utils.insertDecl(decl, prop, value);
        });
        return void 0;
      }
    };
    GridRowColumn.names = ["grid-row", "grid-column"];
    module.exports = GridRowColumn;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-rows-columns.js
var require_grid_rows_columns = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-rows-columns.js"(exports, module) {
    var Declaration = require_declaration();
    var {
      prefixTrackProp,
      prefixTrackValue,
      autoplaceGridItems,
      getGridGap,
      inheritGridGap
    } = require_grid_utils();
    var Processor = require_processor();
    var GridRowsColumns = class extends Declaration {
      prefixed(prop, prefix) {
        if (prefix === "-ms-") {
          return prefixTrackProp({ prop, prefix });
        }
        return super.prefixed(prop, prefix);
      }
      normalize(prop) {
        return prop.replace(/^grid-(rows|columns)/, "grid-template-$1");
      }
      insert(decl, prefix, prefixes, result) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        let { parent, prop, value } = decl;
        let isRowProp = prop.includes("rows");
        let isColumnProp = prop.includes("columns");
        let hasGridTemplate = parent.some(
          (i) => i.prop === "grid-template" || i.prop === "grid-template-areas"
        );
        if (hasGridTemplate && isRowProp) {
          return false;
        }
        let processor = new Processor({ options: {} });
        let status = processor.gridStatus(parent, result);
        let gap = getGridGap(decl);
        gap = inheritGridGap(decl, gap) || gap;
        let gapValue = isRowProp ? gap.row : gap.column;
        if ((status === "no-autoplace" || status === true) && !hasGridTemplate) {
          gapValue = null;
        }
        let prefixValue = prefixTrackValue({
          value,
          gap: gapValue
        });
        decl.cloneBefore({
          prop: prefixTrackProp({ prop, prefix }),
          value: prefixValue
        });
        let autoflow = parent.nodes.find((i) => i.prop === "grid-auto-flow");
        let autoflowValue = "row";
        if (autoflow && !processor.disabled(autoflow, result)) {
          autoflowValue = autoflow.value.trim();
        }
        if (status === "autoplace") {
          let rowDecl = parent.nodes.find((i) => i.prop === "grid-template-rows");
          if (!rowDecl && hasGridTemplate) {
            return void 0;
          } else if (!rowDecl && !hasGridTemplate) {
            decl.warn(
              result,
              "Autoplacement does not work without grid-template-rows property"
            );
            return void 0;
          }
          let columnDecl = parent.nodes.find((i) => {
            return i.prop === "grid-template-columns";
          });
          if (!columnDecl && !hasGridTemplate) {
            decl.warn(
              result,
              "Autoplacement does not work without grid-template-columns property"
            );
          }
          if (isColumnProp && !hasGridTemplate) {
            autoplaceGridItems(decl, result, gap, autoflowValue);
          }
        }
        return void 0;
      }
    };
    GridRowsColumns.names = [
      "grid-template-rows",
      "grid-template-columns",
      "grid-rows",
      "grid-columns"
    ];
    module.exports = GridRowsColumns;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-column-align.js
var require_grid_column_align = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-column-align.js"(exports, module) {
    var Declaration = require_declaration();
    var GridColumnAlign = class extends Declaration {
      check(decl) {
        return !decl.value.includes("flex-") && decl.value !== "baseline";
      }
      prefixed(prop, prefix) {
        return prefix + "grid-column-align";
      }
      normalize() {
        return "justify-self";
      }
    };
    GridColumnAlign.names = ["grid-column-align"];
    module.exports = GridColumnAlign;
  }
});

// node_modules/autoprefixer/lib/hacks/print-color-adjust.js
var require_print_color_adjust = __commonJS({
  "node_modules/autoprefixer/lib/hacks/print-color-adjust.js"(exports, module) {
    var Declaration = require_declaration();
    var PrintColorAdjust = class extends Declaration {
      prefixed(prop, prefix) {
        if (prefix === "-moz-") {
          return "color-adjust";
        } else {
          return prefix + "print-color-adjust";
        }
      }
      normalize() {
        return "print-color-adjust";
      }
    };
    PrintColorAdjust.names = ["print-color-adjust", "color-adjust"];
    module.exports = PrintColorAdjust;
  }
});

// node_modules/autoprefixer/lib/hacks/overscroll-behavior.js
var require_overscroll_behavior = __commonJS({
  "node_modules/autoprefixer/lib/hacks/overscroll-behavior.js"(exports, module) {
    var Declaration = require_declaration();
    var OverscrollBehavior = class extends Declaration {
      prefixed(prop, prefix) {
        return prefix + "scroll-chaining";
      }
      normalize() {
        return "overscroll-behavior";
      }
      set(decl, prefix) {
        if (decl.value === "auto") {
          decl.value = "chained";
        } else if (decl.value === "none" || decl.value === "contain") {
          decl.value = "none";
        }
        return super.set(decl, prefix);
      }
    };
    OverscrollBehavior.names = ["overscroll-behavior", "scroll-chaining"];
    module.exports = OverscrollBehavior;
  }
});

// node_modules/autoprefixer/lib/hacks/grid-template-areas.js
var require_grid_template_areas = __commonJS({
  "node_modules/autoprefixer/lib/hacks/grid-template-areas.js"(exports, module) {
    var Declaration = require_declaration();
    var {
      parseGridAreas,
      warnMissedAreas,
      prefixTrackProp,
      prefixTrackValue,
      getGridGap,
      warnGridGap,
      inheritGridGap
    } = require_grid_utils();
    function getGridRows(tpl) {
      return tpl.trim().slice(1, -1).split(/["']\s*["']?/g);
    }
    var GridTemplateAreas = class extends Declaration {
      insert(decl, prefix, prefixes, result) {
        if (prefix !== "-ms-")
          return super.insert(decl, prefix, prefixes);
        let hasColumns = false;
        let hasRows = false;
        let parent = decl.parent;
        let gap = getGridGap(decl);
        gap = inheritGridGap(decl, gap) || gap;
        parent.walkDecls(/-ms-grid-rows/, (i) => i.remove());
        parent.walkDecls(/grid-template-(rows|columns)/, (trackDecl) => {
          if (trackDecl.prop === "grid-template-rows") {
            hasRows = true;
            let { prop, value } = trackDecl;
            trackDecl.cloneBefore({
              prop: prefixTrackProp({ prop, prefix }),
              value: prefixTrackValue({ value, gap: gap.row })
            });
          } else {
            hasColumns = true;
          }
        });
        let gridRows = getGridRows(decl.value);
        if (hasColumns && !hasRows && gap.row && gridRows.length > 1) {
          decl.cloneBefore({
            prop: "-ms-grid-rows",
            value: prefixTrackValue({
              value: `repeat(${gridRows.length}, auto)`,
              gap: gap.row
            }),
            raws: {}
          });
        }
        warnGridGap({
          gap,
          hasColumns,
          decl,
          result
        });
        let areas = parseGridAreas({
          rows: gridRows,
          gap
        });
        warnMissedAreas(areas, decl, result);
        return decl;
      }
    };
    GridTemplateAreas.names = ["grid-template-areas"];
    module.exports = GridTemplateAreas;
  }
});

// node_modules/autoprefixer/lib/hacks/text-emphasis-position.js
var require_text_emphasis_position = __commonJS({
  "node_modules/autoprefixer/lib/hacks/text-emphasis-position.js"(exports, module) {
    var Declaration = require_declaration();
    var TextEmphasisPosition = class extends Declaration {
      set(decl, prefix) {
        if (prefix === "-webkit-") {
          decl.value = decl.value.replace(/\s*(right|left)\s*/i, "");
        }
        return super.set(decl, prefix);
      }
    };
    TextEmphasisPosition.names = ["text-emphasis-position"];
    module.exports = TextEmphasisPosition;
  }
});

// node_modules/autoprefixer/lib/hacks/text-decoration-skip-ink.js
var require_text_decoration_skip_ink = __commonJS({
  "node_modules/autoprefixer/lib/hacks/text-decoration-skip-ink.js"(exports, module) {
    var Declaration = require_declaration();
    var TextDecorationSkipInk = class extends Declaration {
      set(decl, prefix) {
        if (decl.prop === "text-decoration-skip-ink" && decl.value === "auto") {
          decl.prop = prefix + "text-decoration-skip";
          decl.value = "ink";
          return decl;
        } else {
          return super.set(decl, prefix);
        }
      }
    };
    TextDecorationSkipInk.names = [
      "text-decoration-skip-ink",
      "text-decoration-skip"
    ];
    module.exports = TextDecorationSkipInk;
  }
});

// node_modules/normalize-range/index.js
var require_normalize_range = __commonJS({
  "node_modules/normalize-range/index.js"(exports, module) {
    "use strict";
    module.exports = {
      wrap: wrapRange,
      limit: limitRange,
      validate: validateRange,
      test: testRange,
      curry,
      name
    };
    function wrapRange(min, max, value) {
      var maxLessMin = max - min;
      return ((value - min) % maxLessMin + maxLessMin) % maxLessMin + min;
    }
    function limitRange(min, max, value) {
      return Math.max(min, Math.min(max, value));
    }
    function validateRange(min, max, value, minExclusive, maxExclusive) {
      if (!testRange(min, max, value, minExclusive, maxExclusive)) {
        throw new Error(value + " is outside of range [" + min + "," + max + ")");
      }
      return value;
    }
    function testRange(min, max, value, minExclusive, maxExclusive) {
      return !(value < min || value > max || maxExclusive && value === max || minExclusive && value === min);
    }
    function name(min, max, minExcl, maxExcl) {
      return (minExcl ? "(" : "[") + min + "," + max + (maxExcl ? ")" : "]");
    }
    function curry(min, max, minExclusive, maxExclusive) {
      var boundNameFn = name.bind(null, min, max, minExclusive, maxExclusive);
      return {
        wrap: wrapRange.bind(null, min, max),
        limit: limitRange.bind(null, min, max),
        validate: function(value) {
          return validateRange(min, max, value, minExclusive, maxExclusive);
        },
        test: function(value) {
          return testRange(min, max, value, minExclusive, maxExclusive);
        },
        toString: boundNameFn,
        name: boundNameFn
      };
    }
  }
});

// node_modules/autoprefixer/lib/hacks/gradient.js
var require_gradient = __commonJS({
  "node_modules/autoprefixer/lib/hacks/gradient.js"(exports, module) {
    var parser = require_lib();
    var range = require_normalize_range();
    var OldValue = require_old_value();
    var Value = require_value();
    var utils = require_utils();
    var IS_DIRECTION = /top|left|right|bottom/gi;
    var Gradient = class extends Value {
      replace(string, prefix) {
        let ast = parser(string);
        for (let node of ast.nodes) {
          if (node.type === "function" && node.value === this.name) {
            node.nodes = this.newDirection(node.nodes);
            node.nodes = this.normalize(node.nodes);
            if (prefix === "-webkit- old") {
              let changes = this.oldWebkit(node);
              if (!changes) {
                return false;
              }
            } else {
              node.nodes = this.convertDirection(node.nodes);
              node.value = prefix + node.value;
            }
          }
        }
        return ast.toString();
      }
      replaceFirst(params, ...words) {
        let prefix = words.map((i) => {
          if (i === " ") {
            return { type: "space", value: i };
          }
          return { type: "word", value: i };
        });
        return prefix.concat(params.slice(1));
      }
      normalizeUnit(str, full) {
        let num = parseFloat(str);
        let deg = num / full * 360;
        return `${deg}deg`;
      }
      normalize(nodes) {
        if (!nodes[0])
          return nodes;
        if (/-?\d+(.\d+)?grad/.test(nodes[0].value)) {
          nodes[0].value = this.normalizeUnit(nodes[0].value, 400);
        } else if (/-?\d+(.\d+)?rad/.test(nodes[0].value)) {
          nodes[0].value = this.normalizeUnit(nodes[0].value, 2 * Math.PI);
        } else if (/-?\d+(.\d+)?turn/.test(nodes[0].value)) {
          nodes[0].value = this.normalizeUnit(nodes[0].value, 1);
        } else if (nodes[0].value.includes("deg")) {
          let num = parseFloat(nodes[0].value);
          num = range.wrap(0, 360, num);
          nodes[0].value = `${num}deg`;
        }
        if (nodes[0].value === "0deg") {
          nodes = this.replaceFirst(nodes, "to", " ", "top");
        } else if (nodes[0].value === "90deg") {
          nodes = this.replaceFirst(nodes, "to", " ", "right");
        } else if (nodes[0].value === "180deg") {
          nodes = this.replaceFirst(nodes, "to", " ", "bottom");
        } else if (nodes[0].value === "270deg") {
          nodes = this.replaceFirst(nodes, "to", " ", "left");
        }
        return nodes;
      }
      newDirection(params) {
        if (params[0].value === "to") {
          return params;
        }
        IS_DIRECTION.lastIndex = 0;
        if (!IS_DIRECTION.test(params[0].value)) {
          return params;
        }
        params.unshift(
          {
            type: "word",
            value: "to"
          },
          {
            type: "space",
            value: " "
          }
        );
        for (let i = 2; i < params.length; i++) {
          if (params[i].type === "div") {
            break;
          }
          if (params[i].type === "word") {
            params[i].value = this.revertDirection(params[i].value);
          }
        }
        return params;
      }
      isRadial(params) {
        let state = "before";
        for (let param of params) {
          if (state === "before" && param.type === "space") {
            state = "at";
          } else if (state === "at" && param.value === "at") {
            state = "after";
          } else if (state === "after" && param.type === "space") {
            return true;
          } else if (param.type === "div") {
            break;
          } else {
            state = "before";
          }
        }
        return false;
      }
      convertDirection(params) {
        if (params.length > 0) {
          if (params[0].value === "to") {
            this.fixDirection(params);
          } else if (params[0].value.includes("deg")) {
            this.fixAngle(params);
          } else if (this.isRadial(params)) {
            this.fixRadial(params);
          }
        }
        return params;
      }
      fixDirection(params) {
        params.splice(0, 2);
        for (let param of params) {
          if (param.type === "div") {
            break;
          }
          if (param.type === "word") {
            param.value = this.revertDirection(param.value);
          }
        }
      }
      fixAngle(params) {
        let first = params[0].value;
        first = parseFloat(first);
        first = Math.abs(450 - first) % 360;
        first = this.roundFloat(first, 3);
        params[0].value = `${first}deg`;
      }
      fixRadial(params) {
        let first = [];
        let second = [];
        let a, b, c, i, next;
        for (i = 0; i < params.length - 2; i++) {
          a = params[i];
          b = params[i + 1];
          c = params[i + 2];
          if (a.type === "space" && b.value === "at" && c.type === "space") {
            next = i + 3;
            break;
          } else {
            first.push(a);
          }
        }
        let div;
        for (i = next; i < params.length; i++) {
          if (params[i].type === "div") {
            div = params[i];
            break;
          } else {
            second.push(params[i]);
          }
        }
        params.splice(0, i, ...second, div, ...first);
      }
      revertDirection(word) {
        return Gradient.directions[word.toLowerCase()] || word;
      }
      roundFloat(float, digits) {
        return parseFloat(float.toFixed(digits));
      }
      oldWebkit(node) {
        let { nodes } = node;
        let string = parser.stringify(node.nodes);
        if (this.name !== "linear-gradient") {
          return false;
        }
        if (nodes[0] && nodes[0].value.includes("deg")) {
          return false;
        }
        if (string.includes("px") || string.includes("-corner") || string.includes("-side")) {
          return false;
        }
        let params = [[]];
        for (let i of nodes) {
          params[params.length - 1].push(i);
          if (i.type === "div" && i.value === ",") {
            params.push([]);
          }
        }
        this.oldDirection(params);
        this.colorStops(params);
        node.nodes = [];
        for (let param of params) {
          node.nodes = node.nodes.concat(param);
        }
        node.nodes.unshift(
          { type: "word", value: "linear" },
          this.cloneDiv(node.nodes)
        );
        node.value = "-webkit-gradient";
        return true;
      }
      oldDirection(params) {
        let div = this.cloneDiv(params[0]);
        if (params[0][0].value !== "to") {
          return params.unshift([
            { type: "word", value: Gradient.oldDirections.bottom },
            div
          ]);
        } else {
          let words = [];
          for (let node of params[0].slice(2)) {
            if (node.type === "word") {
              words.push(node.value.toLowerCase());
            }
          }
          words = words.join(" ");
          let old = Gradient.oldDirections[words] || words;
          params[0] = [{ type: "word", value: old }, div];
          return params[0];
        }
      }
      cloneDiv(params) {
        for (let i of params) {
          if (i.type === "div" && i.value === ",") {
            return i;
          }
        }
        return { type: "div", value: ",", after: " " };
      }
      colorStops(params) {
        let result = [];
        for (let i = 0; i < params.length; i++) {
          let pos;
          let param = params[i];
          let item;
          if (i === 0) {
            continue;
          }
          let color = parser.stringify(param[0]);
          if (param[1] && param[1].type === "word") {
            pos = param[1].value;
          } else if (param[2] && param[2].type === "word") {
            pos = param[2].value;
          }
          let stop;
          if (i === 1 && (!pos || pos === "0%")) {
            stop = `from(${color})`;
          } else if (i === params.length - 1 && (!pos || pos === "100%")) {
            stop = `to(${color})`;
          } else if (pos) {
            stop = `color-stop(${pos}, ${color})`;
          } else {
            stop = `color-stop(${color})`;
          }
          let div = param[param.length - 1];
          params[i] = [{ type: "word", value: stop }];
          if (div.type === "div" && div.value === ",") {
            item = params[i].push(div);
          }
          result.push(item);
        }
        return result;
      }
      old(prefix) {
        if (prefix === "-webkit-") {
          let type = this.name === "linear-gradient" ? "linear" : "radial";
          let string = "-gradient";
          let regexp = utils.regexp(
            `-webkit-(${type}-gradient|gradient\\(\\s*${type})`,
            false
          );
          return new OldValue(this.name, prefix + this.name, string, regexp);
        } else {
          return super.old(prefix);
        }
      }
      add(decl, prefix) {
        let p = decl.prop;
        if (p.includes("mask")) {
          if (prefix === "-webkit-" || prefix === "-webkit- old") {
            return super.add(decl, prefix);
          }
        } else if (p === "list-style" || p === "list-style-image" || p === "content") {
          if (prefix === "-webkit-" || prefix === "-webkit- old") {
            return super.add(decl, prefix);
          }
        } else {
          return super.add(decl, prefix);
        }
        return void 0;
      }
    };
    Gradient.names = [
      "linear-gradient",
      "repeating-linear-gradient",
      "radial-gradient",
      "repeating-radial-gradient"
    ];
    Gradient.directions = {
      top: "bottom",
      left: "right",
      bottom: "top",
      right: "left"
    };
    Gradient.oldDirections = {
      "top": "left bottom, left top",
      "left": "right top, left top",
      "bottom": "left top, left bottom",
      "right": "left top, right top",
      "top right": "left bottom, right top",
      "top left": "right bottom, left top",
      "right top": "left bottom, right top",
      "right bottom": "left top, right bottom",
      "bottom right": "left top, right bottom",
      "bottom left": "right top, left bottom",
      "left top": "right bottom, left top",
      "left bottom": "right top, left bottom"
    };
    module.exports = Gradient;
  }
});

// node_modules/autoprefixer/lib/hacks/intrinsic.js
var require_intrinsic = __commonJS({
  "node_modules/autoprefixer/lib/hacks/intrinsic.js"(exports, module) {
    var OldValue = require_old_value();
    var Value = require_value();
    function regexp(name) {
      return new RegExp(`(^|[\\s,(])(${name}($|[\\s),]))`, "gi");
    }
    var Intrinsic = class extends Value {
      regexp() {
        if (!this.regexpCache)
          this.regexpCache = regexp(this.name);
        return this.regexpCache;
      }
      isStretch() {
        return this.name === "stretch" || this.name === "fill" || this.name === "fill-available";
      }
      replace(string, prefix) {
        if (prefix === "-moz-" && this.isStretch()) {
          return string.replace(this.regexp(), "$1-moz-available$3");
        }
        if (prefix === "-webkit-" && this.isStretch()) {
          return string.replace(this.regexp(), "$1-webkit-fill-available$3");
        }
        return super.replace(string, prefix);
      }
      old(prefix) {
        let prefixed = prefix + this.name;
        if (this.isStretch()) {
          if (prefix === "-moz-") {
            prefixed = "-moz-available";
          } else if (prefix === "-webkit-") {
            prefixed = "-webkit-fill-available";
          }
        }
        return new OldValue(this.name, prefixed, prefixed, regexp(prefixed));
      }
      add(decl, prefix) {
        if (decl.prop.includes("grid") && prefix !== "-webkit-") {
          return void 0;
        }
        return super.add(decl, prefix);
      }
    };
    Intrinsic.names = [
      "max-content",
      "min-content",
      "fit-content",
      "fill",
      "fill-available",
      "stretch"
    ];
    module.exports = Intrinsic;
  }
});

// node_modules/autoprefixer/lib/hacks/pixelated.js
var require_pixelated = __commonJS({
  "node_modules/autoprefixer/lib/hacks/pixelated.js"(exports, module) {
    var OldValue = require_old_value();
    var Value = require_value();
    var Pixelated = class extends Value {
      replace(string, prefix) {
        if (prefix === "-webkit-") {
          return string.replace(this.regexp(), "$1-webkit-optimize-contrast");
        }
        if (prefix === "-moz-") {
          return string.replace(this.regexp(), "$1-moz-crisp-edges");
        }
        return super.replace(string, prefix);
      }
      old(prefix) {
        if (prefix === "-webkit-") {
          return new OldValue(this.name, "-webkit-optimize-contrast");
        }
        if (prefix === "-moz-") {
          return new OldValue(this.name, "-moz-crisp-edges");
        }
        return super.old(prefix);
      }
    };
    Pixelated.names = ["pixelated"];
    module.exports = Pixelated;
  }
});

// node_modules/autoprefixer/lib/hacks/image-set.js
var require_image_set = __commonJS({
  "node_modules/autoprefixer/lib/hacks/image-set.js"(exports, module) {
    var Value = require_value();
    var ImageSet = class extends Value {
      replace(string, prefix) {
        let fixed = super.replace(string, prefix);
        if (prefix === "-webkit-") {
          fixed = fixed.replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, "url($1)$2");
        }
        return fixed;
      }
    };
    ImageSet.names = ["image-set"];
    module.exports = ImageSet;
  }
});

// node_modules/autoprefixer/lib/hacks/cross-fade.js
var require_cross_fade = __commonJS({
  "node_modules/autoprefixer/lib/hacks/cross-fade.js"(exports, module) {
    var list = require_postcss().list;
    var Value = require_value();
    var CrossFade = class extends Value {
      replace(string, prefix) {
        return list.space(string).map((value) => {
          if (value.slice(0, +this.name.length + 1) !== this.name + "(") {
            return value;
          }
          let close = value.lastIndexOf(")");
          let after = value.slice(close + 1);
          let args = value.slice(this.name.length + 1, close);
          if (prefix === "-webkit-") {
            let match = args.match(/\d*.?\d+%?/);
            if (match) {
              args = args.slice(match[0].length).trim();
              args += `, ${match[0]}`;
            } else {
              args += ", 0.5";
            }
          }
          return prefix + this.name + "(" + args + ")" + after;
        }).join(" ");
      }
    };
    CrossFade.names = ["cross-fade"];
    module.exports = CrossFade;
  }
});

// node_modules/autoprefixer/lib/hacks/display-flex.js
var require_display_flex = __commonJS({
  "node_modules/autoprefixer/lib/hacks/display-flex.js"(exports, module) {
    var flexSpec = require_flex_spec();
    var OldValue = require_old_value();
    var Value = require_value();
    var DisplayFlex = class extends Value {
      constructor(name, prefixes) {
        super(name, prefixes);
        if (name === "display-flex") {
          this.name = "flex";
        }
      }
      check(decl) {
        return decl.prop === "display" && decl.value === this.name;
      }
      prefixed(prefix) {
        let spec, value;
        [spec, prefix] = flexSpec(prefix);
        if (spec === 2009) {
          if (this.name === "flex") {
            value = "box";
          } else {
            value = "inline-box";
          }
        } else if (spec === 2012) {
          if (this.name === "flex") {
            value = "flexbox";
          } else {
            value = "inline-flexbox";
          }
        } else if (spec === "final") {
          value = this.name;
        }
        return prefix + value;
      }
      replace(string, prefix) {
        return this.prefixed(prefix);
      }
      old(prefix) {
        let prefixed = this.prefixed(prefix);
        if (!prefixed)
          return void 0;
        return new OldValue(this.name, prefixed);
      }
    };
    DisplayFlex.names = ["display-flex", "inline-flex"];
    module.exports = DisplayFlex;
  }
});

// node_modules/autoprefixer/lib/hacks/display-grid.js
var require_display_grid = __commonJS({
  "node_modules/autoprefixer/lib/hacks/display-grid.js"(exports, module) {
    var Value = require_value();
    var DisplayGrid = class extends Value {
      constructor(name, prefixes) {
        super(name, prefixes);
        if (name === "display-grid") {
          this.name = "grid";
        }
      }
      check(decl) {
        return decl.prop === "display" && decl.value === this.name;
      }
    };
    DisplayGrid.names = ["display-grid", "inline-grid"];
    module.exports = DisplayGrid;
  }
});

// node_modules/autoprefixer/lib/hacks/filter-value.js
var require_filter_value = __commonJS({
  "node_modules/autoprefixer/lib/hacks/filter-value.js"(exports, module) {
    var Value = require_value();
    var FilterValue = class extends Value {
      constructor(name, prefixes) {
        super(name, prefixes);
        if (name === "filter-function") {
          this.name = "filter";
        }
      }
    };
    FilterValue.names = ["filter", "filter-function"];
    module.exports = FilterValue;
  }
});

// node_modules/autoprefixer/lib/hacks/autofill.js
var require_autofill = __commonJS({
  "node_modules/autoprefixer/lib/hacks/autofill.js"(exports, module) {
    var Selector = require_selector();
    var utils = require_utils();
    var Autofill = class extends Selector {
      constructor(name, prefixes, all) {
        super(name, prefixes, all);
        if (this.prefixes) {
          this.prefixes = utils.uniq(this.prefixes.map(() => "-webkit-"));
        }
      }
      prefixed(prefix) {
        if (prefix === "-webkit-") {
          return ":-webkit-autofill";
        }
        return `:${prefix}autofill`;
      }
    };
    Autofill.names = [":autofill"];
    module.exports = Autofill;
  }
});

// node_modules/autoprefixer/lib/prefixes.js
var require_prefixes = __commonJS({
  "node_modules/autoprefixer/lib/prefixes.js"(exports, module) {
    var vendor = require_vendor();
    var Declaration = require_declaration();
    var Resolution = require_resolution();
    var Transition = require_transition();
    var Processor = require_processor();
    var Supports = require_supports();
    var Browsers = require_browsers();
    var Selector = require_selector();
    var AtRule = require_at_rule();
    var Value = require_value();
    var utils = require_utils();
    var hackFullscreen = require_fullscreen2();
    var hackPlaceholder = require_placeholder();
    var hackPlaceholderShown = require_placeholder_shown();
    var hackFileSelectorButton = require_file_selector_button();
    var hackFlex = require_flex();
    var hackOrder = require_order();
    var hackFilter = require_filter();
    var hackGridEnd = require_grid_end();
    var hackAnimation = require_animation();
    var hackFlexFlow = require_flex_flow();
    var hackFlexGrow = require_flex_grow();
    var hackFlexWrap = require_flex_wrap();
    var hackGridArea = require_grid_area();
    var hackPlaceSelf = require_place_self();
    var hackGridStart = require_grid_start();
    var hackAlignSelf = require_align_self();
    var hackAppearance = require_appearance();
    var hackFlexBasis = require_flex_basis();
    var hackMaskBorder = require_mask_border();
    var hackMaskComposite = require_mask_composite();
    var hackAlignItems = require_align_items();
    var hackUserSelect = require_user_select();
    var hackFlexShrink = require_flex_shrink();
    var hackBreakProps = require_break_props();
    var hackWritingMode = require_writing_mode();
    var hackBorderImage = require_border_image2();
    var hackAlignContent = require_align_content();
    var hackBorderRadius = require_border_radius2();
    var hackBlockLogical = require_block_logical();
    var hackGridTemplate = require_grid_template();
    var hackInlineLogical = require_inline_logical();
    var hackGridRowAlign = require_grid_row_align();
    var hackTransformDecl = require_transform_decl();
    var hackFlexDirection = require_flex_direction();
    var hackImageRendering = require_image_rendering();
    var hackBackdropFilter = require_backdrop_filter();
    var hackBackgroundClip = require_background_clip();
    var hackTextDecoration = require_text_decoration2();
    var hackJustifyContent = require_justify_content();
    var hackBackgroundSize = require_background_size();
    var hackGridRowColumn = require_grid_row_column();
    var hackGridRowsColumns = require_grid_rows_columns();
    var hackGridColumnAlign = require_grid_column_align();
    var hackPrintColorAdjust = require_print_color_adjust();
    var hackOverscrollBehavior = require_overscroll_behavior();
    var hackGridTemplateAreas = require_grid_template_areas();
    var hackTextEmphasisPosition = require_text_emphasis_position();
    var hackTextDecorationSkipInk = require_text_decoration_skip_ink();
    var hackGradient = require_gradient();
    var hackIntrinsic = require_intrinsic();
    var hackPixelated = require_pixelated();
    var hackImageSet = require_image_set();
    var hackCrossFade = require_cross_fade();
    var hackDisplayFlex = require_display_flex();
    var hackDisplayGrid = require_display_grid();
    var hackFilterValue = require_filter_value();
    var hackAutofill = require_autofill();
    Selector.hack(hackAutofill);
    Selector.hack(hackFullscreen);
    Selector.hack(hackPlaceholder);
    Selector.hack(hackPlaceholderShown);
    Selector.hack(hackFileSelectorButton);
    Declaration.hack(hackFlex);
    Declaration.hack(hackOrder);
    Declaration.hack(hackFilter);
    Declaration.hack(hackGridEnd);
    Declaration.hack(hackAnimation);
    Declaration.hack(hackFlexFlow);
    Declaration.hack(hackFlexGrow);
    Declaration.hack(hackFlexWrap);
    Declaration.hack(hackGridArea);
    Declaration.hack(hackPlaceSelf);
    Declaration.hack(hackGridStart);
    Declaration.hack(hackAlignSelf);
    Declaration.hack(hackAppearance);
    Declaration.hack(hackFlexBasis);
    Declaration.hack(hackMaskBorder);
    Declaration.hack(hackMaskComposite);
    Declaration.hack(hackAlignItems);
    Declaration.hack(hackUserSelect);
    Declaration.hack(hackFlexShrink);
    Declaration.hack(hackBreakProps);
    Declaration.hack(hackWritingMode);
    Declaration.hack(hackBorderImage);
    Declaration.hack(hackAlignContent);
    Declaration.hack(hackBorderRadius);
    Declaration.hack(hackBlockLogical);
    Declaration.hack(hackGridTemplate);
    Declaration.hack(hackInlineLogical);
    Declaration.hack(hackGridRowAlign);
    Declaration.hack(hackTransformDecl);
    Declaration.hack(hackFlexDirection);
    Declaration.hack(hackImageRendering);
    Declaration.hack(hackBackdropFilter);
    Declaration.hack(hackBackgroundClip);
    Declaration.hack(hackTextDecoration);
    Declaration.hack(hackJustifyContent);
    Declaration.hack(hackBackgroundSize);
    Declaration.hack(hackGridRowColumn);
    Declaration.hack(hackGridRowsColumns);
    Declaration.hack(hackGridColumnAlign);
    Declaration.hack(hackOverscrollBehavior);
    Declaration.hack(hackGridTemplateAreas);
    Declaration.hack(hackPrintColorAdjust);
    Declaration.hack(hackTextEmphasisPosition);
    Declaration.hack(hackTextDecorationSkipInk);
    Value.hack(hackGradient);
    Value.hack(hackIntrinsic);
    Value.hack(hackPixelated);
    Value.hack(hackImageSet);
    Value.hack(hackCrossFade);
    Value.hack(hackDisplayFlex);
    Value.hack(hackDisplayGrid);
    Value.hack(hackFilterValue);
    var declsCache = /* @__PURE__ */ new Map();
    var Prefixes = class {
      constructor(data, browsers, options = {}) {
        this.data = data;
        this.browsers = browsers;
        this.options = options;
        [this.add, this.remove] = this.preprocess(this.select(this.data));
        this.transition = new Transition(this);
        this.processor = new Processor(this);
      }
      cleaner() {
        if (this.cleanerCache) {
          return this.cleanerCache;
        }
        if (this.browsers.selected.length) {
          let empty = new Browsers(this.browsers.data, []);
          this.cleanerCache = new Prefixes(this.data, empty, this.options);
        } else {
          return this;
        }
        return this.cleanerCache;
      }
      select(list) {
        let selected = { add: {}, remove: {} };
        for (let name in list) {
          let data = list[name];
          let add = data.browsers.map((i) => {
            let params = i.split(" ");
            return {
              browser: `${params[0]} ${params[1]}`,
              note: params[2]
            };
          });
          let notes = add.filter((i) => i.note).map((i) => `${this.browsers.prefix(i.browser)} ${i.note}`);
          notes = utils.uniq(notes);
          add = add.filter((i) => this.browsers.isSelected(i.browser)).map((i) => {
            let prefix = this.browsers.prefix(i.browser);
            if (i.note) {
              return `${prefix} ${i.note}`;
            } else {
              return prefix;
            }
          });
          add = this.sort(utils.uniq(add));
          if (this.options.flexbox === "no-2009") {
            add = add.filter((i) => !i.includes("2009"));
          }
          let all = data.browsers.map((i) => this.browsers.prefix(i));
          if (data.mistakes) {
            all = all.concat(data.mistakes);
          }
          all = all.concat(notes);
          all = utils.uniq(all);
          if (add.length) {
            selected.add[name] = add;
            if (add.length < all.length) {
              selected.remove[name] = all.filter((i) => !add.includes(i));
            }
          } else {
            selected.remove[name] = all;
          }
        }
        return selected;
      }
      sort(prefixes) {
        return prefixes.sort((a, b) => {
          let aLength = utils.removeNote(a).length;
          let bLength = utils.removeNote(b).length;
          if (aLength === bLength) {
            return b.length - a.length;
          } else {
            return bLength - aLength;
          }
        });
      }
      preprocess(selected) {
        let add = {
          "selectors": [],
          "@supports": new Supports(Prefixes, this)
        };
        for (let name in selected.add) {
          let prefixes = selected.add[name];
          if (name === "@keyframes" || name === "@viewport") {
            add[name] = new AtRule(name, prefixes, this);
          } else if (name === "@resolution") {
            add[name] = new Resolution(name, prefixes, this);
          } else if (this.data[name].selector) {
            add.selectors.push(Selector.load(name, prefixes, this));
          } else {
            let props = this.data[name].props;
            if (props) {
              let value = Value.load(name, prefixes, this);
              for (let prop of props) {
                if (!add[prop]) {
                  add[prop] = { values: [] };
                }
                add[prop].values.push(value);
              }
            } else {
              let values = add[name] && add[name].values || [];
              add[name] = Declaration.load(name, prefixes, this);
              add[name].values = values;
            }
          }
        }
        let remove = { selectors: [] };
        for (let name in selected.remove) {
          let prefixes = selected.remove[name];
          if (this.data[name].selector) {
            let selector = Selector.load(name, prefixes);
            for (let prefix of prefixes) {
              remove.selectors.push(selector.old(prefix));
            }
          } else if (name === "@keyframes" || name === "@viewport") {
            for (let prefix of prefixes) {
              let prefixed = `@${prefix}${name.slice(1)}`;
              remove[prefixed] = { remove: true };
            }
          } else if (name === "@resolution") {
            remove[name] = new Resolution(name, prefixes, this);
          } else {
            let props = this.data[name].props;
            if (props) {
              let value = Value.load(name, [], this);
              for (let prefix of prefixes) {
                let old = value.old(prefix);
                if (old) {
                  for (let prop of props) {
                    if (!remove[prop]) {
                      remove[prop] = {};
                    }
                    if (!remove[prop].values) {
                      remove[prop].values = [];
                    }
                    remove[prop].values.push(old);
                  }
                }
              }
            } else {
              for (let p of prefixes) {
                let olds = this.decl(name).old(name, p);
                if (name === "align-self") {
                  let a = add[name] && add[name].prefixes;
                  if (a) {
                    if (p === "-webkit- 2009" && a.includes("-webkit-")) {
                      continue;
                    } else if (p === "-webkit-" && a.includes("-webkit- 2009")) {
                      continue;
                    }
                  }
                }
                for (let prefixed of olds) {
                  if (!remove[prefixed]) {
                    remove[prefixed] = {};
                  }
                  remove[prefixed].remove = true;
                }
              }
            }
          }
        }
        return [add, remove];
      }
      decl(prop) {
        if (!declsCache.has(prop)) {
          declsCache.set(prop, Declaration.load(prop));
        }
        return declsCache.get(prop);
      }
      unprefixed(prop) {
        let value = this.normalize(vendor.unprefixed(prop));
        if (value === "flex-direction") {
          value = "flex-flow";
        }
        return value;
      }
      normalize(prop) {
        return this.decl(prop).normalize(prop);
      }
      prefixed(prop, prefix) {
        prop = vendor.unprefixed(prop);
        return this.decl(prop).prefixed(prop, prefix);
      }
      values(type, prop) {
        let data = this[type];
        let global = data["*"] && data["*"].values;
        let values = data[prop] && data[prop].values;
        if (global && values) {
          return utils.uniq(global.concat(values));
        } else {
          return global || values || [];
        }
      }
      group(decl) {
        let rule = decl.parent;
        let index = rule.index(decl);
        let { length } = rule.nodes;
        let unprefixed = this.unprefixed(decl.prop);
        let checker = (step, callback) => {
          index += step;
          while (index >= 0 && index < length) {
            let other = rule.nodes[index];
            if (other.type === "decl") {
              if (step === -1 && other.prop === unprefixed) {
                if (!Browsers.withPrefix(other.value)) {
                  break;
                }
              }
              if (this.unprefixed(other.prop) !== unprefixed) {
                break;
              } else if (callback(other) === true) {
                return true;
              }
              if (step === 1 && other.prop === unprefixed) {
                if (!Browsers.withPrefix(other.value)) {
                  break;
                }
              }
            }
            index += step;
          }
          return false;
        };
        return {
          up(callback) {
            return checker(-1, callback);
          },
          down(callback) {
            return checker(1, callback);
          }
        };
      }
    };
    module.exports = Prefixes;
  }
});

// node_modules/autoprefixer/data/prefixes.js
var require_prefixes2 = __commonJS({
  "node_modules/autoprefixer/data/prefixes.js"(exports, module) {
    var unpack = require_unpacker().feature;
    function browsersSort(a, b) {
      a = a.split(" ");
      b = b.split(" ");
      if (a[0] > b[0]) {
        return 1;
      } else if (a[0] < b[0]) {
        return -1;
      } else {
        return Math.sign(parseFloat(a[1]) - parseFloat(b[1]));
      }
    }
    function f(data, opts, callback) {
      data = unpack(data);
      if (!callback) {
        ;
        [callback, opts] = [opts, {}];
      }
      let match = opts.match || /\sx($|\s)/;
      let need = [];
      for (let browser in data.stats) {
        let versions = data.stats[browser];
        for (let version in versions) {
          let support = versions[version];
          if (support.match(match)) {
            need.push(browser + " " + version);
          }
        }
      }
      callback(need.sort(browsersSort));
    }
    var result = {};
    function prefix(names, data) {
      for (let name of names) {
        result[name] = Object.assign({}, data);
      }
    }
    function add(names, data) {
      for (let name of names) {
        result[name].browsers = result[name].browsers.concat(data.browsers).sort(browsersSort);
      }
    }
    module.exports = result;
    var prefixBorderRadius = require_border_radius();
    f(
      prefixBorderRadius,
      (browsers) => prefix(
        [
          "border-radius",
          "border-top-left-radius",
          "border-top-right-radius",
          "border-bottom-right-radius",
          "border-bottom-left-radius"
        ],
        {
          mistakes: ["-khtml-", "-ms-", "-o-"],
          feature: "border-radius",
          browsers
        }
      )
    );
    var prefixBoxshadow = require_css_boxshadow();
    f(
      prefixBoxshadow,
      (browsers) => prefix(["box-shadow"], {
        mistakes: ["-khtml-"],
        feature: "css-boxshadow",
        browsers
      })
    );
    var prefixAnimation = require_css_animation();
    f(
      prefixAnimation,
      (browsers) => prefix(
        [
          "animation",
          "animation-name",
          "animation-duration",
          "animation-delay",
          "animation-direction",
          "animation-fill-mode",
          "animation-iteration-count",
          "animation-play-state",
          "animation-timing-function",
          "@keyframes"
        ],
        {
          mistakes: ["-khtml-", "-ms-"],
          feature: "css-animation",
          browsers
        }
      )
    );
    var prefixTransition = require_css_transitions();
    f(
      prefixTransition,
      (browsers) => prefix(
        [
          "transition",
          "transition-property",
          "transition-duration",
          "transition-delay",
          "transition-timing-function"
        ],
        {
          mistakes: ["-khtml-", "-ms-"],
          browsers,
          feature: "css-transitions"
        }
      )
    );
    var prefixTransform2d = require_transforms2d();
    f(
      prefixTransform2d,
      (browsers) => prefix(["transform", "transform-origin"], {
        feature: "transforms2d",
        browsers
      })
    );
    var prefixTransforms3d = require_transforms3d();
    f(prefixTransforms3d, (browsers) => {
      prefix(["perspective", "perspective-origin"], {
        feature: "transforms3d",
        browsers
      });
      return prefix(["transform-style"], {
        mistakes: ["-ms-", "-o-"],
        browsers,
        feature: "transforms3d"
      });
    });
    f(
      prefixTransforms3d,
      { match: /y\sx|y\s#2/ },
      (browsers) => prefix(["backface-visibility"], {
        mistakes: ["-ms-", "-o-"],
        feature: "transforms3d",
        browsers
      })
    );
    var prefixGradients = require_css_gradients();
    f(
      prefixGradients,
      { match: /y\sx/ },
      (browsers) => prefix(
        [
          "linear-gradient",
          "repeating-linear-gradient",
          "radial-gradient",
          "repeating-radial-gradient"
        ],
        {
          props: [
            "background",
            "background-image",
            "border-image",
            "mask",
            "list-style",
            "list-style-image",
            "content",
            "mask-image"
          ],
          mistakes: ["-ms-"],
          feature: "css-gradients",
          browsers
        }
      )
    );
    f(prefixGradients, { match: /a\sx/ }, (browsers) => {
      browsers = browsers.map((i) => {
        if (/firefox|op/.test(i)) {
          return i;
        } else {
          return `${i} old`;
        }
      });
      return add(
        [
          "linear-gradient",
          "repeating-linear-gradient",
          "radial-gradient",
          "repeating-radial-gradient"
        ],
        {
          feature: "css-gradients",
          browsers
        }
      );
    });
    var prefixBoxsizing = require_css3_boxsizing();
    f(
      prefixBoxsizing,
      (browsers) => prefix(["box-sizing"], {
        feature: "css3-boxsizing",
        browsers
      })
    );
    var prefixFilters = require_css_filters();
    f(
      prefixFilters,
      (browsers) => prefix(["filter"], {
        feature: "css-filters",
        browsers
      })
    );
    var prefixFilterFunction = require_css_filter_function();
    f(
      prefixFilterFunction,
      (browsers) => prefix(["filter-function"], {
        props: [
          "background",
          "background-image",
          "border-image",
          "mask",
          "list-style",
          "list-style-image",
          "content",
          "mask-image"
        ],
        feature: "css-filter-function",
        browsers
      })
    );
    var prefixBackdrop = require_css_backdrop_filter();
    f(
      prefixBackdrop,
      { match: /y\sx|y\s#2/ },
      (browsers) => prefix(["backdrop-filter"], {
        feature: "css-backdrop-filter",
        browsers
      })
    );
    var prefixElementFunction = require_css_element_function();
    f(
      prefixElementFunction,
      (browsers) => prefix(["element"], {
        props: [
          "background",
          "background-image",
          "border-image",
          "mask",
          "list-style",
          "list-style-image",
          "content",
          "mask-image"
        ],
        feature: "css-element-function",
        browsers
      })
    );
    var prefixMulticolumns = require_multicolumn();
    f(prefixMulticolumns, (browsers) => {
      prefix(
        [
          "columns",
          "column-width",
          "column-gap",
          "column-rule",
          "column-rule-color",
          "column-rule-width",
          "column-count",
          "column-rule-style",
          "column-span",
          "column-fill"
        ],
        {
          feature: "multicolumn",
          browsers
        }
      );
      let noff = browsers.filter((i) => !/firefox/.test(i));
      prefix(["break-before", "break-after", "break-inside"], {
        feature: "multicolumn",
        browsers: noff
      });
    });
    var prefixUserSelect = require_user_select_none();
    f(
      prefixUserSelect,
      (browsers) => prefix(["user-select"], {
        mistakes: ["-khtml-"],
        feature: "user-select-none",
        browsers
      })
    );
    var prefixFlexbox = require_flexbox();
    f(prefixFlexbox, { match: /a\sx/ }, (browsers) => {
      browsers = browsers.map((i) => {
        if (/ie|firefox/.test(i)) {
          return i;
        } else {
          return `${i} 2009`;
        }
      });
      prefix(["display-flex", "inline-flex"], {
        props: ["display"],
        feature: "flexbox",
        browsers
      });
      prefix(["flex", "flex-grow", "flex-shrink", "flex-basis"], {
        feature: "flexbox",
        browsers
      });
      prefix(
        [
          "flex-direction",
          "flex-wrap",
          "flex-flow",
          "justify-content",
          "order",
          "align-items",
          "align-self",
          "align-content"
        ],
        {
          feature: "flexbox",
          browsers
        }
      );
    });
    f(prefixFlexbox, { match: /y\sx/ }, (browsers) => {
      add(["display-flex", "inline-flex"], {
        feature: "flexbox",
        browsers
      });
      add(["flex", "flex-grow", "flex-shrink", "flex-basis"], {
        feature: "flexbox",
        browsers
      });
      add(
        [
          "flex-direction",
          "flex-wrap",
          "flex-flow",
          "justify-content",
          "order",
          "align-items",
          "align-self",
          "align-content"
        ],
        {
          feature: "flexbox",
          browsers
        }
      );
    });
    var prefixCalc = require_calc();
    f(
      prefixCalc,
      (browsers) => prefix(["calc"], {
        props: ["*"],
        feature: "calc",
        browsers
      })
    );
    var prefixBackgroundOptions = require_background_img_opts();
    f(
      prefixBackgroundOptions,
      (browsers) => prefix(["background-origin", "background-size"], {
        feature: "background-img-opts",
        browsers
      })
    );
    var prefixBackgroundClipText = require_background_clip_text();
    f(
      prefixBackgroundClipText,
      (browsers) => prefix(["background-clip"], {
        feature: "background-clip-text",
        browsers
      })
    );
    var prefixFontFeature = require_font_feature();
    f(
      prefixFontFeature,
      (browsers) => prefix(
        [
          "font-feature-settings",
          "font-variant-ligatures",
          "font-language-override"
        ],
        {
          feature: "font-feature",
          browsers
        }
      )
    );
    var prefixFontKerning = require_font_kerning();
    f(
      prefixFontKerning,
      (browsers) => prefix(["font-kerning"], {
        feature: "font-kerning",
        browsers
      })
    );
    var prefixBorderImage = require_border_image();
    f(
      prefixBorderImage,
      (browsers) => prefix(["border-image"], {
        feature: "border-image",
        browsers
      })
    );
    var prefixSelection = require_css_selection();
    f(
      prefixSelection,
      (browsers) => prefix(["::selection"], {
        selector: true,
        feature: "css-selection",
        browsers
      })
    );
    var prefixPlaceholder = require_css_placeholder();
    f(prefixPlaceholder, (browsers) => {
      prefix(["::placeholder"], {
        selector: true,
        feature: "css-placeholder",
        browsers: browsers.concat(["ie 10 old", "ie 11 old", "firefox 18 old"])
      });
    });
    var prefixPlaceholderShown = require_css_placeholder_shown();
    f(prefixPlaceholderShown, (browsers) => {
      prefix([":placeholder-shown"], {
        selector: true,
        feature: "css-placeholder-shown",
        browsers
      });
    });
    var prefixHyphens = require_css_hyphens();
    f(
      prefixHyphens,
      (browsers) => prefix(["hyphens"], {
        feature: "css-hyphens",
        browsers
      })
    );
    var prefixFullscreen = require_fullscreen();
    f(
      prefixFullscreen,
      (browsers) => prefix([":fullscreen"], {
        selector: true,
        feature: "fullscreen",
        browsers
      })
    );
    f(
      prefixFullscreen,
      { match: /x(\s#2|$)/ },
      (browsers) => prefix(["::backdrop"], {
        selector: true,
        feature: "fullscreen",
        browsers
      })
    );
    var prefixFileSelectorButton = require_css_file_selector_button();
    f(
      prefixFileSelectorButton,
      (browsers) => prefix(["::file-selector-button"], {
        selector: true,
        feature: "file-selector-button",
        browsers
      })
    );
    var prefixAutofill = require_css_autofill();
    f(
      prefixAutofill,
      (browsers) => prefix([":autofill"], {
        selector: true,
        feature: "css-autofill",
        browsers
      })
    );
    var prefixTabsize = require_css3_tabsize();
    f(
      prefixTabsize,
      (browsers) => prefix(["tab-size"], {
        feature: "css3-tabsize",
        browsers
      })
    );
    var prefixIntrinsic = require_intrinsic_width();
    var sizeProps = [
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",
      "inline-size",
      "min-inline-size",
      "max-inline-size",
      "block-size",
      "min-block-size",
      "max-block-size",
      "grid",
      "grid-template",
      "grid-template-rows",
      "grid-template-columns",
      "grid-auto-columns",
      "grid-auto-rows"
    ];
    f(
      prefixIntrinsic,
      (browsers) => prefix(["max-content", "min-content"], {
        props: sizeProps,
        feature: "intrinsic-width",
        browsers
      })
    );
    f(
      prefixIntrinsic,
      { match: /x|\s#4/ },
      (browsers) => prefix(["fill", "fill-available"], {
        props: sizeProps,
        feature: "intrinsic-width",
        browsers
      })
    );
    f(
      prefixIntrinsic,
      { match: /x|\s#5/ },
      (browsers) => prefix(["fit-content"], {
        props: sizeProps,
        feature: "intrinsic-width",
        browsers
      })
    );
    var prefixStretch = require_css_width_stretch();
    f(
      prefixStretch,
      (browsers) => prefix(["stretch"], {
        props: sizeProps,
        feature: "css-width-stretch",
        browsers
      })
    );
    var prefixCursorsNewer = require_css3_cursors_newer();
    f(
      prefixCursorsNewer,
      (browsers) => prefix(["zoom-in", "zoom-out"], {
        props: ["cursor"],
        feature: "css3-cursors-newer",
        browsers
      })
    );
    var prefixCursorsGrab = require_css3_cursors_grab();
    f(
      prefixCursorsGrab,
      (browsers) => prefix(["grab", "grabbing"], {
        props: ["cursor"],
        feature: "css3-cursors-grab",
        browsers
      })
    );
    var prefixSticky = require_css_sticky();
    f(
      prefixSticky,
      (browsers) => prefix(["sticky"], {
        props: ["position"],
        feature: "css-sticky",
        browsers
      })
    );
    var prefixPointer = require_pointer();
    f(
      prefixPointer,
      (browsers) => prefix(["touch-action"], {
        feature: "pointer",
        browsers
      })
    );
    var prefixDecoration = require_text_decoration();
    f(
      prefixDecoration,
      (browsers) => prefix(
        [
          "text-decoration-style",
          "text-decoration-color",
          "text-decoration-line",
          "text-decoration"
        ],
        {
          feature: "text-decoration",
          browsers
        }
      )
    );
    f(
      prefixDecoration,
      { match: /x.*#[235]/ },
      (browsers) => prefix(["text-decoration-skip", "text-decoration-skip-ink"], {
        feature: "text-decoration",
        browsers
      })
    );
    var prefixTextSizeAdjust = require_text_size_adjust();
    f(
      prefixTextSizeAdjust,
      (browsers) => prefix(["text-size-adjust"], {
        feature: "text-size-adjust",
        browsers
      })
    );
    var prefixCssMasks = require_css_masks();
    f(prefixCssMasks, (browsers) => {
      prefix(
        [
          "mask-clip",
          "mask-composite",
          "mask-image",
          "mask-origin",
          "mask-repeat",
          "mask-border-repeat",
          "mask-border-source"
        ],
        {
          feature: "css-masks",
          browsers
        }
      );
      prefix(
        [
          "mask",
          "mask-position",
          "mask-size",
          "mask-border",
          "mask-border-outset",
          "mask-border-width",
          "mask-border-slice"
        ],
        {
          feature: "css-masks",
          browsers
        }
      );
    });
    var prefixClipPath = require_css_clip_path();
    f(
      prefixClipPath,
      (browsers) => prefix(["clip-path"], {
        feature: "css-clip-path",
        browsers
      })
    );
    var prefixBoxdecoration = require_css_boxdecorationbreak();
    f(
      prefixBoxdecoration,
      (browsers) => prefix(["box-decoration-break"], {
        feature: "css-boxdecorationbreak",
        browsers
      })
    );
    var prefixObjectFit = require_object_fit();
    f(
      prefixObjectFit,
      (browsers) => prefix(["object-fit", "object-position"], {
        feature: "object-fit",
        browsers
      })
    );
    var prefixShapes = require_css_shapes();
    f(
      prefixShapes,
      (browsers) => prefix(["shape-margin", "shape-outside", "shape-image-threshold"], {
        feature: "css-shapes",
        browsers
      })
    );
    var prefixTextOverflow = require_text_overflow();
    f(
      prefixTextOverflow,
      (browsers) => prefix(["text-overflow"], {
        feature: "text-overflow",
        browsers
      })
    );
    var prefixDeviceadaptation = require_css_deviceadaptation();
    f(
      prefixDeviceadaptation,
      (browsers) => prefix(["@viewport"], {
        feature: "css-deviceadaptation",
        browsers
      })
    );
    var prefixResolut = require_css_media_resolution();
    f(
      prefixResolut,
      { match: /( x($| )|a #2)/ },
      (browsers) => prefix(["@resolution"], {
        feature: "css-media-resolution",
        browsers
      })
    );
    var prefixTextAlignLast = require_css_text_align_last();
    f(
      prefixTextAlignLast,
      (browsers) => prefix(["text-align-last"], {
        feature: "css-text-align-last",
        browsers
      })
    );
    var prefixCrispedges = require_css_crisp_edges();
    f(
      prefixCrispedges,
      { match: /y x|a x #1/ },
      (browsers) => prefix(["pixelated"], {
        props: ["image-rendering"],
        feature: "css-crisp-edges",
        browsers
      })
    );
    f(
      prefixCrispedges,
      { match: /a x #2/ },
      (browsers) => prefix(["image-rendering"], {
        feature: "css-crisp-edges",
        browsers
      })
    );
    var prefixLogicalProps = require_css_logical_props();
    f(
      prefixLogicalProps,
      (browsers) => prefix(
        [
          "border-inline-start",
          "border-inline-end",
          "margin-inline-start",
          "margin-inline-end",
          "padding-inline-start",
          "padding-inline-end"
        ],
        {
          feature: "css-logical-props",
          browsers
        }
      )
    );
    f(
      prefixLogicalProps,
      { match: /x\s#2/ },
      (browsers) => prefix(
        [
          "border-block-start",
          "border-block-end",
          "margin-block-start",
          "margin-block-end",
          "padding-block-start",
          "padding-block-end"
        ],
        {
          feature: "css-logical-props",
          browsers
        }
      )
    );
    var prefixAppearance = require_css_appearance();
    f(
      prefixAppearance,
      { match: /#2|x/ },
      (browsers) => prefix(["appearance"], {
        feature: "css-appearance",
        browsers
      })
    );
    var prefixSnappoints = require_css_snappoints();
    f(
      prefixSnappoints,
      (browsers) => prefix(
        [
          "scroll-snap-type",
          "scroll-snap-coordinate",
          "scroll-snap-destination",
          "scroll-snap-points-x",
          "scroll-snap-points-y"
        ],
        {
          feature: "css-snappoints",
          browsers
        }
      )
    );
    var prefixRegions = require_css_regions();
    f(
      prefixRegions,
      (browsers) => prefix(["flow-into", "flow-from", "region-fragment"], {
        feature: "css-regions",
        browsers
      })
    );
    var prefixImageSet = require_css_image_set();
    f(
      prefixImageSet,
      (browsers) => prefix(["image-set"], {
        props: [
          "background",
          "background-image",
          "border-image",
          "cursor",
          "mask",
          "mask-image",
          "list-style",
          "list-style-image",
          "content"
        ],
        feature: "css-image-set",
        browsers
      })
    );
    var prefixWritingMode = require_css_writing_mode();
    f(
      prefixWritingMode,
      { match: /a|x/ },
      (browsers) => prefix(["writing-mode"], {
        feature: "css-writing-mode",
        browsers
      })
    );
    var prefixCrossFade = require_css_cross_fade();
    f(
      prefixCrossFade,
      (browsers) => prefix(["cross-fade"], {
        props: [
          "background",
          "background-image",
          "border-image",
          "mask",
          "list-style",
          "list-style-image",
          "content",
          "mask-image"
        ],
        feature: "css-cross-fade",
        browsers
      })
    );
    var prefixReadOnly = require_css_read_only_write();
    f(
      prefixReadOnly,
      (browsers) => prefix([":read-only", ":read-write"], {
        selector: true,
        feature: "css-read-only-write",
        browsers
      })
    );
    var prefixTextEmphasis = require_text_emphasis();
    f(
      prefixTextEmphasis,
      (browsers) => prefix(
        [
          "text-emphasis",
          "text-emphasis-position",
          "text-emphasis-style",
          "text-emphasis-color"
        ],
        {
          feature: "text-emphasis",
          browsers
        }
      )
    );
    var prefixGrid = require_css_grid();
    f(prefixGrid, (browsers) => {
      prefix(["display-grid", "inline-grid"], {
        props: ["display"],
        feature: "css-grid",
        browsers
      });
      prefix(
        [
          "grid-template-columns",
          "grid-template-rows",
          "grid-row-start",
          "grid-column-start",
          "grid-row-end",
          "grid-column-end",
          "grid-row",
          "grid-column",
          "grid-area",
          "grid-template",
          "grid-template-areas",
          "place-self"
        ],
        {
          feature: "css-grid",
          browsers
        }
      );
    });
    f(
      prefixGrid,
      { match: /a x/ },
      (browsers) => prefix(["grid-column-align", "grid-row-align"], {
        feature: "css-grid",
        browsers
      })
    );
    var prefixTextSpacing = require_css_text_spacing();
    f(
      prefixTextSpacing,
      (browsers) => prefix(["text-spacing"], {
        feature: "css-text-spacing",
        browsers
      })
    );
    var prefixAnyLink = require_css_any_link();
    f(
      prefixAnyLink,
      (browsers) => prefix([":any-link"], {
        selector: true,
        feature: "css-any-link",
        browsers
      })
    );
    var prefixBidi = require_css_unicode_bidi();
    f(
      prefixBidi,
      (browsers) => prefix(["isolate"], {
        props: ["unicode-bidi"],
        feature: "css-unicode-bidi",
        browsers
      })
    );
    f(
      prefixBidi,
      { match: /y x|a x #2/ },
      (browsers) => prefix(["plaintext"], {
        props: ["unicode-bidi"],
        feature: "css-unicode-bidi",
        browsers
      })
    );
    f(
      prefixBidi,
      { match: /y x/ },
      (browsers) => prefix(["isolate-override"], {
        props: ["unicode-bidi"],
        feature: "css-unicode-bidi",
        browsers
      })
    );
    var prefixOverscroll = require_css_overscroll_behavior();
    f(
      prefixOverscroll,
      { match: /a #1/ },
      (browsers) => prefix(["overscroll-behavior"], {
        feature: "css-overscroll-behavior",
        browsers
      })
    );
    var prefixTextOrientation = require_css_text_orientation();
    f(
      prefixTextOrientation,
      (browsers) => prefix(["text-orientation"], {
        feature: "css-text-orientation",
        browsers
      })
    );
    var prefixPrintAdjust = require_css_print_color_adjust();
    f(
      prefixPrintAdjust,
      (browsers) => prefix(["print-color-adjust", "color-adjust"], {
        feature: "css-print-color-adjust",
        browsers
      })
    );
  }
});

// node_modules/autoprefixer/lib/info.js
var require_info = __commonJS({
  "node_modules/autoprefixer/lib/info.js"(exports, module) {
    var browserslist = require_browserslist();
    function capitalize(str) {
      return str.slice(0, 1).toUpperCase() + str.slice(1);
    }
    var NAMES = {
      ie: "IE",
      ie_mob: "IE Mobile",
      ios_saf: "iOS Safari",
      op_mini: "Opera Mini",
      op_mob: "Opera Mobile",
      and_chr: "Chrome for Android",
      and_ff: "Firefox for Android",
      and_uc: "UC for Android",
      and_qq: "QQ Browser",
      kaios: "KaiOS Browser",
      baidu: "Baidu Browser",
      samsung: "Samsung Internet"
    };
    function prefix(name, prefixes, note) {
      let out = `  ${name}`;
      if (note)
        out += " *";
      out += ": ";
      out += prefixes.map((i) => i.replace(/^-(.*)-$/g, "$1")).join(", ");
      out += "\n";
      return out;
    }
    module.exports = function(prefixes) {
      if (prefixes.browsers.selected.length === 0) {
        return "No browsers selected";
      }
      let versions = {};
      for (let browser of prefixes.browsers.selected) {
        let parts = browser.split(" ");
        let name = parts[0];
        let version = parts[1];
        name = NAMES[name] || capitalize(name);
        if (versions[name]) {
          versions[name].push(version);
        } else {
          versions[name] = [version];
        }
      }
      let out = "Browsers:\n";
      for (let browser in versions) {
        let list = versions[browser];
        list = list.sort((a, b) => parseFloat(b) - parseFloat(a));
        out += `  ${browser}: ${list.join(", ")}
`;
      }
      let coverage = browserslist.coverage(prefixes.browsers.selected);
      let round = Math.round(coverage * 100) / 100;
      out += `
These browsers account for ${round}% of all users globally
`;
      let atrules = [];
      for (let name in prefixes.add) {
        let data = prefixes.add[name];
        if (name[0] === "@" && data.prefixes) {
          atrules.push(prefix(name, data.prefixes));
        }
      }
      if (atrules.length > 0) {
        out += `
At-Rules:
${atrules.sort().join("")}`;
      }
      let selectors = [];
      for (let selector of prefixes.add.selectors) {
        if (selector.prefixes) {
          selectors.push(prefix(selector.name, selector.prefixes));
        }
      }
      if (selectors.length > 0) {
        out += `
Selectors:
${selectors.sort().join("")}`;
      }
      let values = [];
      let props = [];
      let hadGrid = false;
      for (let name in prefixes.add) {
        let data = prefixes.add[name];
        if (name[0] !== "@" && data.prefixes) {
          let grid = name.indexOf("grid-") === 0;
          if (grid)
            hadGrid = true;
          props.push(prefix(name, data.prefixes, grid));
        }
        if (!Array.isArray(data.values)) {
          continue;
        }
        for (let value of data.values) {
          let grid = value.name.includes("grid");
          if (grid)
            hadGrid = true;
          let string = prefix(value.name, value.prefixes, grid);
          if (!values.includes(string)) {
            values.push(string);
          }
        }
      }
      if (props.length > 0) {
        out += `
Properties:
${props.sort().join("")}`;
      }
      if (values.length > 0) {
        out += `
Values:
${values.sort().join("")}`;
      }
      if (hadGrid) {
        out += "\n* - Prefixes will be added only on grid: true option.\n";
      }
      if (!atrules.length && !selectors.length && !props.length && !values.length) {
        out += "\nAwesome! Your browsers don't require any vendor prefixes.\nNow you can remove Autoprefixer from build steps.";
      }
      return out;
    };
  }
});

// node_modules/autoprefixer/lib/autoprefixer.js
var require_autoprefixer = __commonJS({
  "node_modules/autoprefixer/lib/autoprefixer.js"(exports, module) {
    var browserslist = require_browserslist();
    var { agents } = require_unpacker();
    var pico = require_picocolors_browser();
    var Browsers = require_browsers();
    var Prefixes = require_prefixes();
    var dataPrefixes = require_prefixes2();
    var getInfo = require_info();
    var autoprefixerData = { browsers: agents, prefixes: dataPrefixes };
    var WARNING = "\n  Replace Autoprefixer `browsers` option to Browserslist config.\n  Use `browserslist` key in `package.json` or `.browserslistrc` file.\n\n  Using `browsers` option can cause errors. Browserslist config can\n  be used for Babel, Autoprefixer, postcss-normalize and other tools.\n\n  If you really need to use option, rename it to `overrideBrowserslist`.\n\n  Learn more at:\n  https://github.com/browserslist/browserslist#readme\n  https://twitter.com/browserslist\n\n";
    function isPlainObject(obj) {
      return Object.prototype.toString.apply(obj) === "[object Object]";
    }
    var cache = /* @__PURE__ */ new Map();
    function timeCapsule(result, prefixes) {
      if (prefixes.browsers.selected.length === 0) {
        return;
      }
      if (prefixes.add.selectors.length > 0) {
        return;
      }
      if (Object.keys(prefixes.add).length > 2) {
        return;
      }
      result.warn(
        "Autoprefixer target browsers do not need any prefixes.You do not need Autoprefixer anymore.\nCheck your Browserslist config to be sure that your targets are set up correctly.\n\n  Learn more at:\n  https://github.com/postcss/autoprefixer#readme\n  https://github.com/browserslist/browserslist#readme\n\n"
      );
    }
    module.exports = plugin;
    function plugin(...reqs) {
      let options;
      if (reqs.length === 1 && isPlainObject(reqs[0])) {
        options = reqs[0];
        reqs = void 0;
      } else if (reqs.length === 0 || reqs.length === 1 && !reqs[0]) {
        reqs = void 0;
      } else if (reqs.length <= 2 && (Array.isArray(reqs[0]) || !reqs[0])) {
        options = reqs[1];
        reqs = reqs[0];
      } else if (typeof reqs[reqs.length - 1] === "object") {
        options = reqs.pop();
      }
      if (!options) {
        options = {};
      }
      if (options.browser) {
        throw new Error(
          "Change `browser` option to `overrideBrowserslist` in Autoprefixer"
        );
      } else if (options.browserslist) {
        throw new Error(
          "Change `browserslist` option to `overrideBrowserslist` in Autoprefixer"
        );
      }
      if (options.overrideBrowserslist) {
        reqs = options.overrideBrowserslist;
      } else if (options.browsers) {
        if (typeof console !== "undefined" && console.warn) {
          console.warn(
            pico.red(WARNING.replace(/`[^`]+`/g, (i) => pico.yellow(i.slice(1, -1))))
          );
        }
        reqs = options.browsers;
      }
      let brwlstOpts = {
        ignoreUnknownVersions: options.ignoreUnknownVersions,
        stats: options.stats,
        env: options.env
      };
      function loadPrefixes(opts) {
        let d = autoprefixerData;
        let browsers = new Browsers(d.browsers, reqs, opts, brwlstOpts);
        let key = browsers.selected.join(", ") + JSON.stringify(options);
        if (!cache.has(key)) {
          cache.set(key, new Prefixes(d.prefixes, browsers, options));
        }
        return cache.get(key);
      }
      return {
        postcssPlugin: "autoprefixer",
        prepare(result) {
          let prefixes = loadPrefixes({
            from: result.opts.from,
            env: options.env
          });
          return {
            OnceExit(root) {
              timeCapsule(result, prefixes);
              if (options.remove !== false) {
                prefixes.processor.remove(root, result);
              }
              if (options.add !== false) {
                prefixes.processor.add(root, result);
              }
            }
          };
        },
        info(opts) {
          opts = opts || {};
          opts.from = opts.from || process.cwd();
          return getInfo(loadPrefixes(opts));
        },
        options,
        browsers: reqs
      };
    }
    plugin.postcss = true;
    plugin.data = autoprefixerData;
    plugin.defaults = browserslist.defaults;
    plugin.info = () => plugin().info();
  }
});

// dep:@typhonjs-fvtt_runtime___autoprefixer
var typhonjs_fvtt_runtime_autoprefixer_default = require_autoprefixer();
export {
  typhonjs_fvtt_runtime_autoprefixer_default as default
};
/**
 * @license Fraction.js v4.2.0 05/03/2022
 * https://www.xarg.org/2014/03/rational-numbers-in-javascript/
 *
 * Copyright (c) 2021, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
//# sourceMappingURL=@typhonjs-fvtt_runtime___autoprefixer.js.map
