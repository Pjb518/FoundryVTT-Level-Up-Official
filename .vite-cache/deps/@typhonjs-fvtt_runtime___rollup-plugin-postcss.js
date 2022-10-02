import {
  require_array_set,
  require_base64_vlq,
  require_browser,
  require_dist,
  require_dist2,
  require_os,
  require_source_map_generator,
  require_src,
  require_util
} from "./chunk-QJEX3QQS.js";
import {
  init_pluginutils_es,
  pluginutils_es_exports,
  require_module
} from "./chunk-HWDPUMUZ.js";
import {
  require_fs,
  require_lib,
  require_postcss
} from "./chunk-3GZT463K.js";
import {
  require_path
} from "./chunk-KRUPHXZG.js";
import {
  __commonJS,
  __esm,
  __export,
  __require,
  __toCommonJS,
  __toESM
} from "./chunk-S5KM4IGW.js";

// node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS({
  "node_modules/source-map/lib/binary-search.js"(exports) {
    exports.GREATEST_LOWER_BOUND = 1;
    exports.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow;
      var cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        } else {
          return mid;
        }
      } else {
        if (mid - aLow > 1) {
          return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports.LEAST_UPPER_BOUND) {
          return mid;
        } else {
          return aLow < 0 ? -1 : aLow;
        }
      }
    }
    exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      var index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports.GREATEST_LOWER_BOUND
      );
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  }
});

// node_modules/source-map/lib/quick-sort.js
var require_quick_sort = __commonJS({
  "node_modules/source-map/lib/quick-sort.js"(exports) {
    function swap(ary, x, y) {
      var temp = ary[x];
      ary[x] = ary[y];
      ary[y] = temp;
    }
    function randomIntInRange(low, high) {
      return Math.round(low + Math.random() * (high - low));
    }
    function doQuickSort(ary, comparator, p, r) {
      if (p < r) {
        var pivotIndex = randomIntInRange(p, r);
        var i = p - 1;
        swap(ary, pivotIndex, r);
        var pivot = ary[r];
        for (var j = p; j < r; j++) {
          if (comparator(ary[j], pivot) <= 0) {
            i += 1;
            swap(ary, i, j);
          }
        }
        swap(ary, i + 1, j);
        var q = i + 1;
        doQuickSort(ary, comparator, p, q - 1);
        doQuickSort(ary, comparator, q + 1, r);
      }
    }
    exports.quickSort = function(ary, comparator) {
      doQuickSort(ary, comparator, 0, ary.length - 1);
    };
  }
});

// node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS({
  "node_modules/source-map/lib/source-map-consumer.js"(exports) {
    var util = require_util();
    var binarySearch = require_binary_search();
    var ArraySet = require_array_set().ArraySet;
    var base64VLQ = require_base64_vlq();
    var quickSort = require_quick_sort().quickSort;
    function SourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
    }
    SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
      return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
    };
    SourceMapConsumer.prototype._version = 3;
    SourceMapConsumer.prototype.__generatedMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
      configurable: true,
      enumerable: true,
      get: function() {
        if (!this.__generatedMappings) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__generatedMappings;
      }
    });
    SourceMapConsumer.prototype.__originalMappings = null;
    Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
      configurable: true,
      enumerable: true,
      get: function() {
        if (!this.__originalMappings) {
          this._parseMappings(this._mappings, this.sourceRoot);
        }
        return this.__originalMappings;
      }
    });
    SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
      var c = aStr.charAt(index);
      return c === ";" || c === ",";
    };
    SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      throw new Error("Subclasses must implement _parseMappings");
    };
    SourceMapConsumer.GENERATED_ORDER = 1;
    SourceMapConsumer.ORIGINAL_ORDER = 2;
    SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
    SourceMapConsumer.LEAST_UPPER_BOUND = 2;
    SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
      var mappings;
      switch (order) {
        case SourceMapConsumer.GENERATED_ORDER:
          mappings = this._generatedMappings;
          break;
        case SourceMapConsumer.ORIGINAL_ORDER:
          mappings = this._originalMappings;
          break;
        default:
          throw new Error("Unknown order of iteration.");
      }
      var sourceRoot = this.sourceRoot;
      mappings.map(function(mapping) {
        var source = mapping.source === null ? null : this._sources.at(mapping.source);
        source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
        return {
          source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name === null ? null : this._names.at(mapping.name)
        };
      }, this).forEach(aCallback, context);
    };
    SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
      var line = util.getArg(aArgs, "line");
      var needle = {
        source: util.getArg(aArgs, "source"),
        originalLine: line,
        originalColumn: util.getArg(aArgs, "column", 0)
      };
      needle.source = this._findSourceIndex(needle.source);
      if (needle.source < 0) {
        return [];
      }
      var mappings = [];
      var index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        binarySearch.LEAST_UPPER_BOUND
      );
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (aArgs.column === void 0) {
          var originalLine = mapping.originalLine;
          while (mapping && mapping.originalLine === originalLine) {
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            });
            mapping = this._originalMappings[++index];
          }
        } else {
          var originalColumn = mapping.originalColumn;
          while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
            mappings.push({
              line: util.getArg(mapping, "generatedLine", null),
              column: util.getArg(mapping, "generatedColumn", null),
              lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
            });
            mapping = this._originalMappings[++index];
          }
        }
      }
      return mappings;
    };
    exports.SourceMapConsumer = SourceMapConsumer;
    function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      var version = util.getArg(sourceMap, "version");
      var sources = util.getArg(sourceMap, "sources");
      var names = util.getArg(sourceMap, "names", []);
      var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
      var sourcesContent = util.getArg(sourceMap, "sourcesContent", null);
      var mappings = util.getArg(sourceMap, "mappings");
      var file = util.getArg(sourceMap, "file", null);
      if (version != this._version) {
        throw new Error("Unsupported version: " + version);
      }
      if (sourceRoot) {
        sourceRoot = util.normalize(sourceRoot);
      }
      sources = sources.map(String).map(util.normalize).map(function(source) {
        return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source) ? util.relative(sourceRoot, source) : source;
      });
      this._names = ArraySet.fromArray(names.map(String), true);
      this._sources = ArraySet.fromArray(sources, true);
      this._absoluteSources = this._sources.toArray().map(function(s) {
        return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
      });
      this.sourceRoot = sourceRoot;
      this.sourcesContent = sourcesContent;
      this._mappings = mappings;
      this._sourceMapURL = aSourceMapURL;
      this.file = file;
    }
    BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
    BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
      var relativeSource = aSource;
      if (this.sourceRoot != null) {
        relativeSource = util.relative(this.sourceRoot, relativeSource);
      }
      if (this._sources.has(relativeSource)) {
        return this._sources.indexOf(relativeSource);
      }
      var i;
      for (i = 0; i < this._absoluteSources.length; ++i) {
        if (this._absoluteSources[i] == aSource) {
          return i;
        }
      }
      return -1;
    };
    BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
      var smc = Object.create(BasicSourceMapConsumer.prototype);
      var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(
        smc._sources.toArray(),
        smc.sourceRoot
      );
      smc.file = aSourceMap._file;
      smc._sourceMapURL = aSourceMapURL;
      smc._absoluteSources = smc._sources.toArray().map(function(s) {
        return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
      });
      var generatedMappings = aSourceMap._mappings.toArray().slice();
      var destGeneratedMappings = smc.__generatedMappings = [];
      var destOriginalMappings = smc.__originalMappings = [];
      for (var i = 0, length = generatedMappings.length; i < length; i++) {
        var srcMapping = generatedMappings[i];
        var destMapping = new Mapping();
        destMapping.generatedLine = srcMapping.generatedLine;
        destMapping.generatedColumn = srcMapping.generatedColumn;
        if (srcMapping.source) {
          destMapping.source = sources.indexOf(srcMapping.source);
          destMapping.originalLine = srcMapping.originalLine;
          destMapping.originalColumn = srcMapping.originalColumn;
          if (srcMapping.name) {
            destMapping.name = names.indexOf(srcMapping.name);
          }
          destOriginalMappings.push(destMapping);
        }
        destGeneratedMappings.push(destMapping);
      }
      quickSort(smc.__originalMappings, util.compareByOriginalPositions);
      return smc;
    };
    BasicSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
      get: function() {
        return this._absoluteSources.slice();
      }
    });
    function Mapping() {
      this.generatedLine = 0;
      this.generatedColumn = 0;
      this.source = null;
      this.originalLine = null;
      this.originalColumn = null;
      this.name = null;
    }
    BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var length = aStr.length;
      var index = 0;
      var cachedSegments = {};
      var temp = {};
      var originalMappings = [];
      var generatedMappings = [];
      var mapping, str, segment, end, value;
      while (index < length) {
        if (aStr.charAt(index) === ";") {
          generatedLine++;
          index++;
          previousGeneratedColumn = 0;
        } else if (aStr.charAt(index) === ",") {
          index++;
        } else {
          mapping = new Mapping();
          mapping.generatedLine = generatedLine;
          for (end = index; end < length; end++) {
            if (this._charIsMappingSeparator(aStr, end)) {
              break;
            }
          }
          str = aStr.slice(index, end);
          segment = cachedSegments[str];
          if (segment) {
            index += str.length;
          } else {
            segment = [];
            while (index < end) {
              base64VLQ.decode(aStr, index, temp);
              value = temp.value;
              index = temp.rest;
              segment.push(value);
            }
            if (segment.length === 2) {
              throw new Error("Found a source, but no line and column");
            }
            if (segment.length === 3) {
              throw new Error("Found a source and line, but no column");
            }
            cachedSegments[str] = segment;
          }
          mapping.generatedColumn = previousGeneratedColumn + segment[0];
          previousGeneratedColumn = mapping.generatedColumn;
          if (segment.length > 1) {
            mapping.source = previousSource + segment[1];
            previousSource += segment[1];
            mapping.originalLine = previousOriginalLine + segment[2];
            previousOriginalLine = mapping.originalLine;
            mapping.originalLine += 1;
            mapping.originalColumn = previousOriginalColumn + segment[3];
            previousOriginalColumn = mapping.originalColumn;
            if (segment.length > 4) {
              mapping.name = previousName + segment[4];
              previousName += segment[4];
            }
          }
          generatedMappings.push(mapping);
          if (typeof mapping.originalLine === "number") {
            originalMappings.push(mapping);
          }
        }
      }
      quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
      this.__generatedMappings = generatedMappings;
      quickSort(originalMappings, util.compareByOriginalPositions);
      this.__originalMappings = originalMappings;
    };
    BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
      if (aNeedle[aLineName] <= 0) {
        throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
      }
      return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
    };
    BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
      for (var index = 0; index < this._generatedMappings.length; ++index) {
        var mapping = this._generatedMappings[index];
        if (index + 1 < this._generatedMappings.length) {
          var nextMapping = this._generatedMappings[index + 1];
          if (mapping.generatedLine === nextMapping.generatedLine) {
            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
            continue;
          }
        }
        mapping.lastGeneratedColumn = Infinity;
      }
    };
    BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      };
      var index = this._findMapping(
        needle,
        this._generatedMappings,
        "generatedLine",
        "generatedColumn",
        util.compareByGeneratedPositionsDeflated,
        util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
      );
      if (index >= 0) {
        var mapping = this._generatedMappings[index];
        if (mapping.generatedLine === needle.generatedLine) {
          var source = util.getArg(mapping, "source", null);
          if (source !== null) {
            source = this._sources.at(source);
            source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
          }
          var name = util.getArg(mapping, "name", null);
          if (name !== null) {
            name = this._names.at(name);
          }
          return {
            source,
            line: util.getArg(mapping, "originalLine", null),
            column: util.getArg(mapping, "originalColumn", null),
            name
          };
        }
      }
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };
    BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
      if (!this.sourcesContent) {
        return false;
      }
      return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
        return sc == null;
      });
    };
    BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      if (!this.sourcesContent) {
        return null;
      }
      var index = this._findSourceIndex(aSource);
      if (index >= 0) {
        return this.sourcesContent[index];
      }
      var relativeSource = aSource;
      if (this.sourceRoot != null) {
        relativeSource = util.relative(this.sourceRoot, relativeSource);
      }
      var url;
      if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
        var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
        if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
        }
        if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
        }
      }
      if (nullOnMissing) {
        return null;
      } else {
        throw new Error('"' + relativeSource + '" is not in the SourceMap.');
      }
    };
    BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
      var source = util.getArg(aArgs, "source");
      source = this._findSourceIndex(source);
      if (source < 0) {
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      }
      var needle = {
        source,
        originalLine: util.getArg(aArgs, "line"),
        originalColumn: util.getArg(aArgs, "column")
      };
      var index = this._findMapping(
        needle,
        this._originalMappings,
        "originalLine",
        "originalColumn",
        util.compareByOriginalPositions,
        util.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
      );
      if (index >= 0) {
        var mapping = this._originalMappings[index];
        if (mapping.source === needle.source) {
          return {
            line: util.getArg(mapping, "generatedLine", null),
            column: util.getArg(mapping, "generatedColumn", null),
            lastColumn: util.getArg(mapping, "lastGeneratedColumn", null)
          };
        }
      }
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    };
    exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
    function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
      var sourceMap = aSourceMap;
      if (typeof aSourceMap === "string") {
        sourceMap = util.parseSourceMapInput(aSourceMap);
      }
      var version = util.getArg(sourceMap, "version");
      var sections = util.getArg(sourceMap, "sections");
      if (version != this._version) {
        throw new Error("Unsupported version: " + version);
      }
      this._sources = new ArraySet();
      this._names = new ArraySet();
      var lastOffset = {
        line: -1,
        column: 0
      };
      this._sections = sections.map(function(s) {
        if (s.url) {
          throw new Error("Support for url field in sections not implemented.");
        }
        var offset = util.getArg(s, "offset");
        var offsetLine = util.getArg(offset, "line");
        var offsetColumn = util.getArg(offset, "column");
        if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
          throw new Error("Section offsets must be ordered and non-overlapping.");
        }
        lastOffset = offset;
        return {
          generatedOffset: {
            generatedLine: offsetLine + 1,
            generatedColumn: offsetColumn + 1
          },
          consumer: new SourceMapConsumer(util.getArg(s, "map"), aSourceMapURL)
        };
      });
    }
    IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
    IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
    IndexedSourceMapConsumer.prototype._version = 3;
    Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
      get: function() {
        var sources = [];
        for (var i = 0; i < this._sections.length; i++) {
          for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
            sources.push(this._sections[i].consumer.sources[j]);
          }
        }
        return sources;
      }
    });
    IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, "line"),
        generatedColumn: util.getArg(aArgs, "column")
      };
      var sectionIndex = binarySearch.search(
        needle,
        this._sections,
        function(needle2, section2) {
          var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
          if (cmp) {
            return cmp;
          }
          return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
        }
      );
      var section = this._sections[sectionIndex];
      if (!section) {
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      }
      return section.consumer.originalPositionFor({
        line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
        column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
        bias: aArgs.bias
      });
    };
    IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
      return this._sections.every(function(s) {
        return s.consumer.hasContentsOfAllSources();
      });
    };
    IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var content = section.consumer.sourceContentFor(aSource, true);
        if (content) {
          return content;
        }
      }
      if (nullOnMissing) {
        return null;
      } else {
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      }
    };
    IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        if (section.consumer._findSourceIndex(util.getArg(aArgs, "source")) === -1) {
          continue;
        }
        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
        if (generatedPosition) {
          var ret = {
            line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
            column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
          };
          return ret;
        }
      }
      return {
        line: null,
        column: null
      };
    };
    IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      this.__generatedMappings = [];
      this.__originalMappings = [];
      for (var i = 0; i < this._sections.length; i++) {
        var section = this._sections[i];
        var sectionMappings = section.consumer._generatedMappings;
        for (var j = 0; j < sectionMappings.length; j++) {
          var mapping = sectionMappings[j];
          var source = section.consumer._sources.at(mapping.source);
          source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
          this._sources.add(source);
          source = this._sources.indexOf(source);
          var name = null;
          if (mapping.name) {
            name = section.consumer._names.at(mapping.name);
            this._names.add(name);
            name = this._names.indexOf(name);
          }
          var adjustedMapping = {
            source,
            generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
            generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name
          };
          this.__generatedMappings.push(adjustedMapping);
          if (typeof adjustedMapping.originalLine === "number") {
            this.__originalMappings.push(adjustedMapping);
          }
        }
      }
      quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
      quickSort(this.__originalMappings, util.compareByOriginalPositions);
    };
    exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  }
});

// node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS({
  "node_modules/source-map/lib/source-node.js"(exports) {
    var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    var util = require_util();
    var REGEX_NEWLINE = /(\r?\n)/;
    var NEWLINE_CODE = 10;
    var isSourceNode = "$$$isSourceNode$$$";
    function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
      this.children = [];
      this.sourceContents = {};
      this.line = aLine == null ? null : aLine;
      this.column = aColumn == null ? null : aColumn;
      this.source = aSource == null ? null : aSource;
      this.name = aName == null ? null : aName;
      this[isSourceNode] = true;
      if (aChunks != null)
        this.add(aChunks);
    }
    SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      var node = new SourceNode();
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var remainingLinesIndex = 0;
      var shiftNextLine = function() {
        var lineContents = getNextLine();
        var newLine = getNextLine() || "";
        return lineContents + newLine;
        function getNextLine() {
          return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
        }
      };
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;
      var lastMapping = null;
      aSourceMapConsumer.eachMapping(function(mapping) {
        if (lastMapping !== null) {
          if (lastGeneratedLine < mapping.generatedLine) {
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
          } else {
            var nextLine = remainingLines[remainingLinesIndex] || "";
            var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
            remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            lastMapping = mapping;
            return;
          }
        }
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      if (remainingLinesIndex < remainingLines.length) {
        if (lastMapping) {
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        node.add(remainingLines.splice(remainingLinesIndex).join(""));
      }
      aSourceMapConsumer.sources.forEach(function(sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });
      return node;
      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === void 0) {
          node.add(code);
        } else {
          var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
          node.add(new SourceNode(
            mapping.originalLine,
            mapping.originalColumn,
            source,
            code,
            mapping.name
          ));
        }
      }
    };
    SourceNode.prototype.add = function SourceNode_add(aChunk) {
      if (Array.isArray(aChunk)) {
        aChunk.forEach(function(chunk) {
          this.add(chunk);
        }, this);
      } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
        if (aChunk) {
          this.children.push(aChunk);
        }
      } else {
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
        );
      }
      return this;
    };
    SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
      if (Array.isArray(aChunk)) {
        for (var i = aChunk.length - 1; i >= 0; i--) {
          this.prepend(aChunk[i]);
        }
      } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
        this.children.unshift(aChunk);
      } else {
        throw new TypeError(
          "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
        );
      }
      return this;
    };
    SourceNode.prototype.walk = function SourceNode_walk(aFn) {
      var chunk;
      for (var i = 0, len = this.children.length; i < len; i++) {
        chunk = this.children[i];
        if (chunk[isSourceNode]) {
          chunk.walk(aFn);
        } else {
          if (chunk !== "") {
            aFn(chunk, {
              source: this.source,
              line: this.line,
              column: this.column,
              name: this.name
            });
          }
        }
      }
    };
    SourceNode.prototype.join = function SourceNode_join(aSep) {
      var newChildren;
      var i;
      var len = this.children.length;
      if (len > 0) {
        newChildren = [];
        for (i = 0; i < len - 1; i++) {
          newChildren.push(this.children[i]);
          newChildren.push(aSep);
        }
        newChildren.push(this.children[i]);
        this.children = newChildren;
      }
      return this;
    };
    SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
      var lastChild = this.children[this.children.length - 1];
      if (lastChild[isSourceNode]) {
        lastChild.replaceRight(aPattern, aReplacement);
      } else if (typeof lastChild === "string") {
        this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
      } else {
        this.children.push("".replace(aPattern, aReplacement));
      }
      return this;
    };
    SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };
    SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i][isSourceNode]) {
          this.children[i].walkSourceContents(aFn);
        }
      }
      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };
    SourceNode.prototype.toString = function SourceNode_toString() {
      var str = "";
      this.walk(function(chunk) {
        str += chunk;
      });
      return str;
    };
    SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
      var generated = {
        code: "",
        line: 1,
        column: 0
      };
      var map = new SourceMapGenerator(aArgs);
      var sourceMappingActive = false;
      var lastOriginalSource = null;
      var lastOriginalLine = null;
      var lastOriginalColumn = null;
      var lastOriginalName = null;
      this.walk(function(chunk, original) {
        generated.code += chunk;
        if (original.source !== null && original.line !== null && original.column !== null) {
          if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
          lastOriginalSource = original.source;
          lastOriginalLine = original.line;
          lastOriginalColumn = original.column;
          lastOriginalName = original.name;
          sourceMappingActive = true;
        } else if (sourceMappingActive) {
          map.addMapping({
            generated: {
              line: generated.line,
              column: generated.column
            }
          });
          lastOriginalSource = null;
          sourceMappingActive = false;
        }
        for (var idx = 0, length = chunk.length; idx < length; idx++) {
          if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
            generated.line++;
            generated.column = 0;
            if (idx + 1 === length) {
              lastOriginalSource = null;
              sourceMappingActive = false;
            } else if (sourceMappingActive) {
              map.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
          } else {
            generated.column++;
          }
        }
      });
      this.walkSourceContents(function(sourceFile, sourceContent) {
        map.setSourceContent(sourceFile, sourceContent);
      });
      return { code: generated.code, map };
    };
    exports.SourceNode = SourceNode;
  }
});

// node_modules/source-map/source-map.js
var require_source_map = __commonJS({
  "node_modules/source-map/source-map.js"(exports) {
    exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
    exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
    exports.SourceNode = require_source_node().SourceNode;
  }
});

// node_modules/concat-with-sourcemaps/index.js
var require_concat_with_sourcemaps = __commonJS({
  "node_modules/concat-with-sourcemaps/index.js"(exports, module) {
    "use strict";
    var SourceMapGenerator = require_source_map().SourceMapGenerator;
    var SourceMapConsumer = require_source_map().SourceMapConsumer;
    function unixStylePath(filePath) {
      return filePath.replace(/\\/g, "/");
    }
    function Concat(generateSourceMap, fileName, separator) {
      this.lineOffset = 0;
      this.columnOffset = 0;
      this.sourceMapping = generateSourceMap;
      this.contentParts = [];
      if (separator === void 0) {
        this.separator = bufferFrom("");
      } else {
        this.separator = bufferFrom(separator);
      }
      if (this.sourceMapping) {
        this._sourceMap = new SourceMapGenerator({ file: unixStylePath(fileName) });
        this.separatorLineOffset = 0;
        this.separatorColumnOffset = 0;
        var separatorString = this.separator.toString();
        for (var i = 0; i < separatorString.length; i++) {
          this.separatorColumnOffset++;
          if (separatorString[i] === "\n") {
            this.separatorLineOffset++;
            this.separatorColumnOffset = 0;
          }
        }
      }
    }
    Concat.prototype.add = function(filePath, content, sourceMap) {
      filePath = filePath && unixStylePath(filePath);
      if (!Buffer.isBuffer(content)) {
        content = bufferFrom(content);
      }
      if (this.contentParts.length !== 0) {
        this.contentParts.push(this.separator);
      }
      this.contentParts.push(content);
      if (this.sourceMapping) {
        var contentString = content.toString();
        var lines = contentString.split("\n").length;
        if (Object.prototype.toString.call(sourceMap) === "[object String]")
          sourceMap = JSON.parse(sourceMap);
        if (sourceMap && sourceMap.mappings && sourceMap.mappings.length > 0) {
          var upstreamSM = new SourceMapConsumer(sourceMap);
          var _this = this;
          upstreamSM.eachMapping(function(mapping) {
            if (mapping.source) {
              _this._sourceMap.addMapping({
                generated: {
                  line: _this.lineOffset + mapping.generatedLine,
                  column: (mapping.generatedLine === 1 ? _this.columnOffset : 0) + mapping.generatedColumn
                },
                original: mapping.originalLine == null ? null : {
                  line: mapping.originalLine,
                  column: mapping.originalColumn
                },
                source: mapping.originalLine != null ? mapping.source : null,
                name: mapping.name
              });
            }
          });
          if (upstreamSM.sourcesContent) {
            upstreamSM.sourcesContent.forEach(function(sourceContent, i2) {
              _this._sourceMap.setSourceContent(upstreamSM.sources[i2], sourceContent);
            });
          }
        } else {
          if (sourceMap && sourceMap.sources && sourceMap.sources.length > 0)
            filePath = sourceMap.sources[0];
          if (filePath) {
            for (var i = 1; i <= lines; i++) {
              this._sourceMap.addMapping({
                generated: {
                  line: this.lineOffset + i,
                  column: i === 1 ? this.columnOffset : 0
                },
                original: {
                  line: i,
                  column: 0
                },
                source: filePath
              });
            }
            if (sourceMap && sourceMap.sourcesContent)
              this._sourceMap.setSourceContent(filePath, sourceMap.sourcesContent[0]);
          }
        }
        if (lines > 1)
          this.columnOffset = 0;
        if (this.separatorLineOffset === 0)
          this.columnOffset += contentString.length - Math.max(0, contentString.lastIndexOf("\n") + 1);
        this.columnOffset += this.separatorColumnOffset;
        this.lineOffset += lines - 1 + this.separatorLineOffset;
      }
    };
    Object.defineProperty(Concat.prototype, "content", {
      get: function content() {
        return Buffer.concat(this.contentParts);
      }
    });
    Object.defineProperty(Concat.prototype, "sourceMap", {
      get: function sourceMap() {
        return this._sourceMap ? this._sourceMap.toString() : void 0;
      }
    });
    function bufferFrom(content) {
      try {
        return Buffer.from(content);
      } catch (e) {
        if (Object.prototype.toString.call(content) !== "[object String]") {
          throw new TypeError("separator must be a string");
        }
        return new Buffer(content);
      }
    }
    Concat.bufferFrom = bufferFrom;
    Concat.default = Concat;
    module.exports = Concat;
  }
});

// node_modules/promise.series/index.js
var require_promise = __commonJS({
  "node_modules/promise.series/index.js"(exports, module) {
    "use strict";
    module.exports = function(tasks, initial) {
      if (!Array.isArray(tasks)) {
        return Promise.reject(new TypeError("promise.series only accepts an array of functions"));
      }
      return tasks.reduce((current, next) => {
        return current.then(next);
      }, Promise.resolve(initial));
    };
  }
});

// node_modules/import-from/node_modules/resolve-from/index.js
var require_resolve_from = __commonJS({
  "node_modules/import-from/node_modules/resolve-from/index.js"(exports, module) {
    "use strict";
    var path = require_path();
    var Module = require_module();
    var fs = require_fs();
    var resolveFrom = (fromDirectory, moduleId, silent) => {
      if (typeof fromDirectory !== "string") {
        throw new TypeError(`Expected \`fromDir\` to be of type \`string\`, got \`${typeof fromDirectory}\``);
      }
      if (typeof moduleId !== "string") {
        throw new TypeError(`Expected \`moduleId\` to be of type \`string\`, got \`${typeof moduleId}\``);
      }
      try {
        fromDirectory = fs.realpathSync(fromDirectory);
      } catch (error) {
        if (error.code === "ENOENT") {
          fromDirectory = path.resolve(fromDirectory);
        } else if (silent) {
          return;
        } else {
          throw error;
        }
      }
      const fromFile = path.join(fromDirectory, "noop.js");
      const resolveFileName = () => Module._resolveFilename(moduleId, {
        id: fromFile,
        filename: fromFile,
        paths: Module._nodeModulePaths(fromDirectory)
      });
      if (silent) {
        try {
          return resolveFileName();
        } catch (error) {
          return;
        }
      }
      return resolveFileName();
    };
    module.exports = (fromDirectory, moduleId) => resolveFrom(fromDirectory, moduleId);
    module.exports.silent = (fromDirectory, moduleId) => resolveFrom(fromDirectory, moduleId, true);
  }
});

// node_modules/import-from/index.js
var require_import_from = __commonJS({
  "node_modules/import-from/index.js"(exports, module) {
    "use strict";
    var resolveFrom = require_resolve_from();
    module.exports = (fromDirectory, moduleId) => __require(resolveFrom(fromDirectory, moduleId));
    module.exports.silent = (fromDirectory, moduleId) => {
      try {
        return __require(resolveFrom(fromDirectory, moduleId));
      } catch (_) {
      }
    };
  }
});

// node_modules/import-cwd/index.js
var require_import_cwd = __commonJS({
  "node_modules/import-cwd/index.js"(exports, module) {
    "use strict";
    var importFrom = require_import_from();
    module.exports = (moduleId) => importFrom(process.cwd(), moduleId);
    module.exports.silent = (moduleId) => importFrom.silent(process.cwd(), moduleId);
  }
});

// node_modules/postcss-load-config/src/req.js
var require_req = __commonJS({
  "node_modules/postcss-load-config/src/req.js"(exports, module) {
    var { createRequire, createRequireFromPath } = require_module();
    function req(name, rootFile) {
      const create = createRequire || createRequireFromPath;
      const require2 = create(rootFile);
      return require2(name);
    }
    module.exports = req;
  }
});

// node_modules/postcss-load-config/src/options.js
var require_options = __commonJS({
  "node_modules/postcss-load-config/src/options.js"(exports, module) {
    "use strict";
    var req = require_req();
    var options = (config, file) => {
      if (config.parser && typeof config.parser === "string") {
        try {
          config.parser = req(config.parser, file);
        } catch (err) {
          throw new Error(`Loading PostCSS Parser failed: ${err.message}

(@${file})`);
        }
      }
      if (config.syntax && typeof config.syntax === "string") {
        try {
          config.syntax = req(config.syntax, file);
        } catch (err) {
          throw new Error(`Loading PostCSS Syntax failed: ${err.message}

(@${file})`);
        }
      }
      if (config.stringifier && typeof config.stringifier === "string") {
        try {
          config.stringifier = req(config.stringifier, file);
        } catch (err) {
          throw new Error(`Loading PostCSS Stringifier failed: ${err.message}

(@${file})`);
        }
      }
      if (config.plugins) {
        delete config.plugins;
      }
      return config;
    };
    module.exports = options;
  }
});

// node_modules/postcss-load-config/src/plugins.js
var require_plugins = __commonJS({
  "node_modules/postcss-load-config/src/plugins.js"(exports, module) {
    "use strict";
    var req = require_req();
    var load = (plugin, options, file) => {
      try {
        if (options === null || options === void 0 || Object.keys(options).length === 0) {
          return req(plugin, file);
        } else {
          return req(plugin, file)(options);
        }
      } catch (err) {
        throw new Error(`Loading PostCSS Plugin failed: ${err.message}

(@${file})`);
      }
    };
    var plugins = (config, file) => {
      let plugins2 = [];
      if (Array.isArray(config.plugins)) {
        plugins2 = config.plugins.filter(Boolean);
      } else {
        plugins2 = Object.keys(config.plugins).filter((plugin) => {
          return config.plugins[plugin] !== false ? plugin : "";
        }).map((plugin) => {
          return load(plugin, config.plugins[plugin], file);
        });
      }
      if (plugins2.length && plugins2.length > 0) {
        plugins2.forEach((plugin, i) => {
          if (plugin.default) {
            plugin = plugin.default;
          }
          if (plugin.postcss === true) {
            plugin = plugin();
          } else if (plugin.postcss) {
            plugin = plugin.postcss;
          }
          if (!(typeof plugin === "object" && Array.isArray(plugin.plugins) || typeof plugin === "object" && plugin.postcssPlugin || typeof plugin === "function")) {
            throw new TypeError(`Invalid PostCSS Plugin found at: plugins[${i}]

(@${file})`);
          }
        });
      }
      return plugins2;
    };
    module.exports = plugins;
  }
});

// node_modules/postcss-load-config/src/index.js
var require_src2 = __commonJS({
  "node_modules/postcss-load-config/src/index.js"(exports, module) {
    "use strict";
    var resolve = require_path().resolve;
    var config = require_dist();
    var yaml = require_browser();
    var loadOptions = require_options();
    var loadPlugins = require_plugins();
    var interopRequireDefault = (obj) => obj && obj.__esModule ? obj : { default: obj };
    var processResult = (ctx, result) => {
      const file = result.filepath || "";
      let config2 = interopRequireDefault(result.config).default || {};
      if (typeof config2 === "function") {
        config2 = config2(ctx);
      } else {
        config2 = Object.assign({}, config2, ctx);
      }
      if (!config2.plugins) {
        config2.plugins = [];
      }
      return {
        plugins: loadPlugins(config2, file),
        options: loadOptions(config2, file),
        file
      };
    };
    var createContext = (ctx) => {
      ctx = Object.assign({
        cwd: process.cwd(),
        env: "development"
      }, ctx);
      if (!ctx.env) {
        "development" = "development";
      }
      return ctx;
    };
    var addTypeScriptLoader = (options = {}, loader) => {
      const moduleName = "postcss";
      return {
        ...options,
        searchPlaces: [
          ...options.searchPlaces || [],
          "package.json",
          `.${moduleName}rc`,
          `.${moduleName}rc.json`,
          `.${moduleName}rc.yaml`,
          `.${moduleName}rc.yml`,
          `.${moduleName}rc.ts`,
          `.${moduleName}rc.js`,
          `.${moduleName}rc.cjs`,
          `${moduleName}.config.ts`,
          `${moduleName}.config.js`,
          `${moduleName}.config.cjs`
        ],
        loaders: {
          ...options.loaders,
          ".yaml": (filepath, content) => yaml.parse(content),
          ".yml": (filepath, content) => yaml.parse(content),
          ".ts": loader
        }
      };
    };
    var withTypeScriptLoader = (rcFunc) => {
      return (ctx, path, options) => {
        return rcFunc(ctx, path, addTypeScriptLoader(options, (configFile) => {
          let registerer = { enabled() {
          } };
          try {
            registerer = __require("ts-node").register();
            return __require(configFile);
          } catch (err) {
            if (err.code === "MODULE_NOT_FOUND") {
              throw new Error(
                `'ts-node' is required for the TypeScript configuration files. Make sure it is installed
Error: ${err.message}`
              );
            }
            throw err;
          } finally {
            registerer.enabled(false);
          }
        }));
      };
    };
    var rc = withTypeScriptLoader((ctx, path, options) => {
      ctx = createContext(ctx);
      path = path ? resolve(path) : process.cwd();
      return config.lilconfig("postcss", options).search(path).then((result) => {
        if (!result) {
          throw new Error(`No PostCSS Config found in: ${path}`);
        }
        return processResult(ctx, result);
      });
    });
    rc.sync = withTypeScriptLoader((ctx, path, options) => {
      ctx = createContext(ctx);
      path = path ? resolve(path) : process.cwd();
      const result = config.lilconfigSync("postcss", options).search(path);
      if (!result) {
        throw new Error(`No PostCSS Config found in: ${path}`);
      }
      return processResult(ctx, result);
    });
    module.exports = rc;
  }
});

// node_modules/safe-identifier/reserved.js
var require_reserved = __commonJS({
  "node_modules/safe-identifier/reserved.js"(exports, module) {
    var ES3 = {
      break: true,
      continue: true,
      delete: true,
      else: true,
      for: true,
      function: true,
      if: true,
      in: true,
      new: true,
      return: true,
      this: true,
      typeof: true,
      var: true,
      void: true,
      while: true,
      with: true,
      case: true,
      catch: true,
      default: true,
      do: true,
      finally: true,
      instanceof: true,
      switch: true,
      throw: true,
      try: true
    };
    var ESnext = {
      await: true,
      debugger: true,
      class: true,
      enum: true,
      extends: true,
      super: true,
      const: true,
      export: true,
      import: true,
      null: true,
      true: true,
      false: true,
      implements: true,
      let: true,
      private: true,
      public: true,
      yield: true,
      interface: true,
      package: true,
      protected: true,
      static: true
    };
    module.exports = { ES3, ESnext };
  }
});

// node_modules/safe-identifier/index.mjs
var safe_identifier_exports = {};
__export(safe_identifier_exports, {
  identifier: () => identifier,
  property: () => property
});
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; ++i) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
function identifier(key, unique) {
  if (unique)
    key += " " + hashCode(key).toString(36);
  const id = key.trim().replace(/\W+/g, "_");
  return import_reserved.default.ES3[id] || import_reserved.default.ESnext[id] || /^\d/.test(id) ? "_" + id : id;
}
function property(obj, key) {
  if (/^[A-Z_$][0-9A-Z_$]*$/i.test(key) && !import_reserved.default.ES3[key]) {
    return obj ? obj + "." + key : key;
  } else {
    const jkey = JSON.stringify(key);
    return obj ? obj + "[" + jkey + "]" : jkey;
  }
}
var import_reserved;
var init_safe_identifier = __esm({
  "node_modules/safe-identifier/index.mjs"() {
    import_reserved = __toESM(require_reserved(), 1);
  }
});

// node_modules/pify/index.js
var require_pify = __commonJS({
  "node_modules/pify/index.js"(exports, module) {
    "use strict";
    var processFn = (fn, options, proxy, unwrapped) => function(...arguments_) {
      const P = options.promiseModule;
      return new P((resolve, reject) => {
        if (options.multiArgs) {
          arguments_.push((...result) => {
            if (options.errorFirst) {
              if (result[0]) {
                reject(result);
              } else {
                result.shift();
                resolve(result);
              }
            } else {
              resolve(result);
            }
          });
        } else if (options.errorFirst) {
          arguments_.push((error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        } else {
          arguments_.push(resolve);
        }
        const self2 = this === proxy ? unwrapped : this;
        Reflect.apply(fn, self2, arguments_);
      });
    };
    var filterCache = /* @__PURE__ */ new WeakMap();
    module.exports = (input, options) => {
      options = {
        exclude: [/.+(?:Sync|Stream)$/],
        errorFirst: true,
        promiseModule: Promise,
        ...options
      };
      const objectType = typeof input;
      if (!(input !== null && (objectType === "object" || objectType === "function"))) {
        throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? "null" : objectType}\``);
      }
      const filter = (target, key) => {
        let cached = filterCache.get(target);
        if (!cached) {
          cached = {};
          filterCache.set(target, cached);
        }
        if (key in cached) {
          return cached[key];
        }
        const match = (pattern) => typeof pattern === "string" || typeof key === "symbol" ? key === pattern : pattern.test(key);
        const desc = Reflect.getOwnPropertyDescriptor(target, key);
        const writableOrConfigurableOwn = desc === void 0 || desc.writable || desc.configurable;
        const included = options.include ? options.include.some(match) : !options.exclude.some(match);
        const shouldFilter = included && writableOrConfigurableOwn;
        cached[key] = shouldFilter;
        return shouldFilter;
      };
      const cache = /* @__PURE__ */ new WeakMap();
      const proxy = new Proxy(input, {
        apply(target, thisArg, args) {
          const cached = cache.get(target);
          if (cached) {
            return Reflect.apply(cached, thisArg, args);
          }
          const pified = options.excludeMain ? target : processFn(target, options, proxy, target);
          cache.set(target, pified);
          return Reflect.apply(pified, thisArg, args);
        },
        get(target, key) {
          const property2 = target[key];
          if (!filter(target, key) || property2 === Function.prototype[key]) {
            return property2;
          }
          const cached = cache.get(property2);
          if (cached) {
            return cached;
          }
          if (typeof property2 === "function") {
            const pified = processFn(property2, options, proxy, target);
            cache.set(property2, pified);
            return pified;
          }
          return property2;
        }
      });
      return proxy;
    };
  }
});

// node_modules/resolve/lib/homedir.js
var require_homedir = __commonJS({
  "node_modules/resolve/lib/homedir.js"(exports, module) {
    "use strict";
    var os = require_os();
    module.exports = os.homedir || function homedir() {
      var home = process.env.HOME;
      var user = process.env.LOGNAME || process.env.USER || process.env.LNAME || process.env.USERNAME;
      if (process.platform === "win32") {
        return process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
      }
      if (process.platform === "darwin") {
        return home || (user ? "/Users/" + user : null);
      }
      if (process.platform === "linux") {
        return home || (process.getuid() === 0 ? "/root" : user ? "/home/" + user : null);
      }
      return home || null;
    };
  }
});

// node_modules/resolve/lib/caller.js
var require_caller = __commonJS({
  "node_modules/resolve/lib/caller.js"(exports, module) {
    module.exports = function() {
      var origPrepareStackTrace = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack2) {
        return stack2;
      };
      var stack = new Error().stack;
      Error.prepareStackTrace = origPrepareStackTrace;
      return stack[2].getFileName();
    };
  }
});

// node_modules/path-parse/index.js
var require_path_parse = __commonJS({
  "node_modules/path-parse/index.js"(exports, module) {
    "use strict";
    var isWindows = process.platform === "win32";
    var splitWindowsRe = /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;
    var win32 = {};
    function win32SplitPath(filename) {
      return splitWindowsRe.exec(filename).slice(1);
    }
    win32.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 5) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[1],
        dir: allParts[0] === allParts[1] ? allParts[0] : allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    var splitPathRe = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/;
    var posix = {};
    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }
    posix.parse = function(pathString) {
      if (typeof pathString !== "string") {
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 5) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[1],
        dir: allParts[0].slice(0, -1),
        base: allParts[2],
        ext: allParts[4],
        name: allParts[3]
      };
    };
    if (isWindows)
      module.exports = win32.parse;
    else
      module.exports = posix.parse;
    module.exports.posix = posix.parse;
    module.exports.win32 = win32.parse;
  }
});

// node_modules/resolve/lib/node-modules-paths.js
var require_node_modules_paths = __commonJS({
  "node_modules/resolve/lib/node-modules-paths.js"(exports, module) {
    var path = require_path();
    var parse = path.parse || require_path_parse();
    var getNodeModulesDirs = function getNodeModulesDirs2(absoluteStart, modules) {
      var prefix = "/";
      if (/^([A-Za-z]:)/.test(absoluteStart)) {
        prefix = "";
      } else if (/^\\\\/.test(absoluteStart)) {
        prefix = "\\\\";
      }
      var paths = [absoluteStart];
      var parsed = parse(absoluteStart);
      while (parsed.dir !== paths[paths.length - 1]) {
        paths.push(parsed.dir);
        parsed = parse(parsed.dir);
      }
      return paths.reduce(function(dirs, aPath) {
        return dirs.concat(modules.map(function(moduleDir) {
          return path.resolve(prefix, aPath, moduleDir);
        }));
      }, []);
    };
    module.exports = function nodeModulesPaths(start, opts, request) {
      var modules = opts && opts.moduleDirectory ? [].concat(opts.moduleDirectory) : ["node_modules"];
      if (opts && typeof opts.paths === "function") {
        return opts.paths(
          request,
          start,
          function() {
            return getNodeModulesDirs(start, modules);
          },
          opts
        );
      }
      var dirs = getNodeModulesDirs(start, modules);
      return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
    };
  }
});

// node_modules/resolve/lib/normalize-options.js
var require_normalize_options = __commonJS({
  "node_modules/resolve/lib/normalize-options.js"(exports, module) {
    module.exports = function(x, opts) {
      return opts || {};
    };
  }
});

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "node_modules/function-bind/implementation.js"(exports, module) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var slice = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = "[object Function]";
    module.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slice.call(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            args.concat(slice.call(arguments))
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        } else {
          return target.apply(
            that,
            args.concat(slice.call(arguments))
          );
        }
      };
      var boundLength = Math.max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs.push("$" + i);
      }
      bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "node_modules/function-bind/index.js"(exports, module) {
    "use strict";
    var implementation = require_implementation();
    module.exports = Function.prototype.bind || implementation;
  }
});

// node_modules/has/src/index.js
var require_src3 = __commonJS({
  "node_modules/has/src/index.js"(exports, module) {
    "use strict";
    var bind = require_function_bind();
    module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
  }
});

// node_modules/is-core-module/core.json
var require_core = __commonJS({
  "node_modules/is-core-module/core.json"(exports, module) {
    module.exports = {
      assert: true,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: true,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: true,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: true,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: true,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: true,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: true,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: true,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: true,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: true,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: true,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: true,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      _linklist: "< 8",
      module: true,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: true,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: true,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: true,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: true,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: true,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: true,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      smalloc: ">= 0.11.5 && < 3",
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: true,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: true,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "node:test": ">= 18",
      timers: true,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: true,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: true,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: true,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: true,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: true,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: ">= 13.4 && < 13.5",
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// node_modules/is-core-module/index.js
var require_is_core_module = __commonJS({
  "node_modules/is-core-module/index.js"(exports, module) {
    "use strict";
    var has = require_src3();
    function specifierIncluded(current, specifier) {
      var nodeParts = current.split(".");
      var parts = specifier.split(" ");
      var op = parts.length > 1 ? parts[0] : "=";
      var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".");
      for (var i = 0; i < 3; ++i) {
        var cur = parseInt(nodeParts[i] || 0, 10);
        var ver = parseInt(versionParts[i] || 0, 10);
        if (cur === ver) {
          continue;
        }
        if (op === "<") {
          return cur < ver;
        }
        if (op === ">=") {
          return cur >= ver;
        }
        return false;
      }
      return op === ">=";
    }
    function matchesRange(current, range) {
      var specifiers = range.split(/ ?&& ?/);
      if (specifiers.length === 0) {
        return false;
      }
      for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(current, specifiers[i])) {
          return false;
        }
      }
      return true;
    }
    function versionIncluded(nodeVersion, specifierValue) {
      if (typeof specifierValue === "boolean") {
        return specifierValue;
      }
      var current = typeof nodeVersion === "undefined" ? process.versions && process.versions.node : nodeVersion;
      if (typeof current !== "string") {
        throw new TypeError(typeof nodeVersion === "undefined" ? "Unable to determine current node version" : "If provided, a valid node version is required");
      }
      if (specifierValue && typeof specifierValue === "object") {
        for (var i = 0; i < specifierValue.length; ++i) {
          if (matchesRange(current, specifierValue[i])) {
            return true;
          }
        }
        return false;
      }
      return matchesRange(current, specifierValue);
    }
    var data = require_core();
    module.exports = function isCore(x, nodeVersion) {
      return has(data, x) && versionIncluded(nodeVersion, data[x]);
    };
  }
});

// node_modules/resolve/lib/async.js
var require_async = __commonJS({
  "node_modules/resolve/lib/async.js"(exports, module) {
    var fs = require_fs();
    var getHomedir = require_homedir();
    var path = require_path();
    var caller = require_caller();
    var nodeModulesPaths = require_node_modules_paths();
    var normalizeOptions = require_normalize_options();
    var isCore = require_is_core_module();
    var realpathFS = process.platform !== "win32" && fs.realpath && typeof fs.realpath.native === "function" ? fs.realpath.native : fs.realpath;
    var homedir = getHomedir();
    var defaultPaths = function() {
      return [
        path.join(homedir, ".node_modules"),
        path.join(homedir, ".node_libraries")
      ];
    };
    var defaultIsFile = function isFile(file, cb) {
      fs.stat(file, function(err, stat) {
        if (!err) {
          return cb(null, stat.isFile() || stat.isFIFO());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
          return cb(null, false);
        return cb(err);
      });
    };
    var defaultIsDir = function isDirectory(dir, cb) {
      fs.stat(dir, function(err, stat) {
        if (!err) {
          return cb(null, stat.isDirectory());
        }
        if (err.code === "ENOENT" || err.code === "ENOTDIR")
          return cb(null, false);
        return cb(err);
      });
    };
    var defaultRealpath = function realpath(x, cb) {
      realpathFS(x, function(realpathErr, realPath) {
        if (realpathErr && realpathErr.code !== "ENOENT")
          cb(realpathErr);
        else
          cb(null, realpathErr ? x : realPath);
      });
    };
    var maybeRealpath = function maybeRealpath2(realpath, x, opts, cb) {
      if (opts && opts.preserveSymlinks === false) {
        realpath(x, cb);
      } else {
        cb(null, x);
      }
    };
    var defaultReadPackage = function defaultReadPackage2(readFile, pkgfile, cb) {
      readFile(pkgfile, function(readFileErr, body) {
        if (readFileErr)
          cb(readFileErr);
        else {
          try {
            var pkg = JSON.parse(body);
            cb(null, pkg);
          } catch (jsonErr) {
            cb(null);
          }
        }
      });
    };
    var getPackageCandidates = function getPackageCandidates2(x, start, opts) {
      var dirs = nodeModulesPaths(start, opts, x);
      for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
      }
      return dirs;
    };
    module.exports = function resolve(x, options, callback) {
      var cb = callback;
      var opts = options;
      if (typeof options === "function") {
        cb = opts;
        opts = {};
      }
      if (typeof x !== "string") {
        var err = new TypeError("Path must be a string.");
        return process.nextTick(function() {
          cb(err);
        });
      }
      opts = normalizeOptions(x, opts);
      var isFile = opts.isFile || defaultIsFile;
      var isDirectory = opts.isDirectory || defaultIsDir;
      var readFile = opts.readFile || fs.readFile;
      var realpath = opts.realpath || defaultRealpath;
      var readPackage = opts.readPackage || defaultReadPackage;
      if (opts.readFile && opts.readPackage) {
        var conflictErr = new TypeError("`readFile` and `readPackage` are mutually exclusive.");
        return process.nextTick(function() {
          cb(conflictErr);
        });
      }
      var packageIterator = opts.packageIterator;
      var extensions = opts.extensions || [".js"];
      var includeCoreModules = opts.includeCoreModules !== false;
      var basedir = opts.basedir || path.dirname(caller());
      var parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = path.resolve(basedir);
      maybeRealpath(
        realpath,
        absoluteStart,
        opts,
        function(err2, realStart) {
          if (err2)
            cb(err2);
          else
            init(realStart);
        }
      );
      var res;
      function init(basedir2) {
        if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
          res = path.resolve(basedir2, x);
          if (x === "." || x === ".." || x.slice(-1) === "/")
            res += "/";
          if (/\/$/.test(x) && res === basedir2) {
            loadAsDirectory(res, opts.package, onfile);
          } else
            loadAsFile(res, opts.package, onfile);
        } else if (includeCoreModules && isCore(x)) {
          return cb(null, x);
        } else
          loadNodeModules(x, basedir2, function(err2, n, pkg) {
            if (err2)
              cb(err2);
            else if (n) {
              return maybeRealpath(realpath, n, opts, function(err3, realN) {
                if (err3) {
                  cb(err3);
                } else {
                  cb(null, realN, pkg);
                }
              });
            } else {
              var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
              moduleError.code = "MODULE_NOT_FOUND";
              cb(moduleError);
            }
          });
      }
      function onfile(err2, m, pkg) {
        if (err2)
          cb(err2);
        else if (m)
          cb(null, m, pkg);
        else
          loadAsDirectory(res, function(err3, d, pkg2) {
            if (err3)
              cb(err3);
            else if (d) {
              maybeRealpath(realpath, d, opts, function(err4, realD) {
                if (err4) {
                  cb(err4);
                } else {
                  cb(null, realD, pkg2);
                }
              });
            } else {
              var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
              moduleError.code = "MODULE_NOT_FOUND";
              cb(moduleError);
            }
          });
      }
      function loadAsFile(x2, thePackage, callback2) {
        var loadAsFilePackage = thePackage;
        var cb2 = callback2;
        if (typeof loadAsFilePackage === "function") {
          cb2 = loadAsFilePackage;
          loadAsFilePackage = void 0;
        }
        var exts = [""].concat(extensions);
        load(exts, x2, loadAsFilePackage);
        function load(exts2, x3, loadPackage) {
          if (exts2.length === 0)
            return cb2(null, void 0, loadPackage);
          var file = x3 + exts2[0];
          var pkg = loadPackage;
          if (pkg)
            onpkg(null, pkg);
          else
            loadpkg(path.dirname(file), onpkg);
          function onpkg(err2, pkg_, dir) {
            pkg = pkg_;
            if (err2)
              return cb2(err2);
            if (dir && pkg && opts.pathFilter) {
              var rfile = path.relative(dir, file);
              var rel = rfile.slice(0, rfile.length - exts2[0].length);
              var r = opts.pathFilter(pkg, x3, rel);
              if (r)
                return load(
                  [""].concat(extensions.slice()),
                  path.resolve(dir, r),
                  pkg
                );
            }
            isFile(file, onex);
          }
          function onex(err2, ex) {
            if (err2)
              return cb2(err2);
            if (ex)
              return cb2(null, file, pkg);
            load(exts2.slice(1), x3, pkg);
          }
        }
      }
      function loadpkg(dir, cb2) {
        if (dir === "" || dir === "/")
          return cb2(null);
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
          return cb2(null);
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
          return cb2(null);
        maybeRealpath(realpath, dir, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr)
            return loadpkg(path.dirname(dir), cb2);
          var pkgfile = path.join(pkgdir, "package.json");
          isFile(pkgfile, function(err2, ex) {
            if (!ex)
              return loadpkg(path.dirname(dir), cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              if (err3)
                cb2(err3);
              var pkg = pkgParam;
              if (pkg && opts.packageFilter) {
                pkg = opts.packageFilter(pkg, pkgfile);
              }
              cb2(null, pkg, dir);
            });
          });
        });
      }
      function loadAsDirectory(x2, loadAsDirectoryPackage, callback2) {
        var cb2 = callback2;
        var fpkg = loadAsDirectoryPackage;
        if (typeof fpkg === "function") {
          cb2 = fpkg;
          fpkg = opts.package;
        }
        maybeRealpath(realpath, x2, opts, function(unwrapErr, pkgdir) {
          if (unwrapErr)
            return cb2(unwrapErr);
          var pkgfile = path.join(pkgdir, "package.json");
          isFile(pkgfile, function(err2, ex) {
            if (err2)
              return cb2(err2);
            if (!ex)
              return loadAsFile(path.join(x2, "index"), fpkg, cb2);
            readPackage(readFile, pkgfile, function(err3, pkgParam) {
              if (err3)
                return cb2(err3);
              var pkg = pkgParam;
              if (pkg && opts.packageFilter) {
                pkg = opts.packageFilter(pkg, pkgfile);
              }
              if (pkg && pkg.main) {
                if (typeof pkg.main !== "string") {
                  var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
                  mainError.code = "INVALID_PACKAGE_MAIN";
                  return cb2(mainError);
                }
                if (pkg.main === "." || pkg.main === "./") {
                  pkg.main = "index";
                }
                loadAsFile(path.resolve(x2, pkg.main), pkg, function(err4, m, pkg2) {
                  if (err4)
                    return cb2(err4);
                  if (m)
                    return cb2(null, m, pkg2);
                  if (!pkg2)
                    return loadAsFile(path.join(x2, "index"), pkg2, cb2);
                  var dir = path.resolve(x2, pkg2.main);
                  loadAsDirectory(dir, pkg2, function(err5, n, pkg3) {
                    if (err5)
                      return cb2(err5);
                    if (n)
                      return cb2(null, n, pkg3);
                    loadAsFile(path.join(x2, "index"), pkg3, cb2);
                  });
                });
                return;
              }
              loadAsFile(path.join(x2, "/index"), pkg, cb2);
            });
          });
        });
      }
      function processDirs(cb2, dirs) {
        if (dirs.length === 0)
          return cb2(null, void 0);
        var dir = dirs[0];
        isDirectory(path.dirname(dir), isdir);
        function isdir(err2, isdir2) {
          if (err2)
            return cb2(err2);
          if (!isdir2)
            return processDirs(cb2, dirs.slice(1));
          loadAsFile(dir, opts.package, onfile2);
        }
        function onfile2(err2, m, pkg) {
          if (err2)
            return cb2(err2);
          if (m)
            return cb2(null, m, pkg);
          loadAsDirectory(dir, opts.package, ondir);
        }
        function ondir(err2, n, pkg) {
          if (err2)
            return cb2(err2);
          if (n)
            return cb2(null, n, pkg);
          processDirs(cb2, dirs.slice(1));
        }
      }
      function loadNodeModules(x2, start, cb2) {
        var thunk = function() {
          return getPackageCandidates(x2, start, opts);
        };
        processDirs(
          cb2,
          packageIterator ? packageIterator(x2, start, thunk, opts) : thunk()
        );
      }
    };
  }
});

// node_modules/resolve/lib/core.json
var require_core2 = __commonJS({
  "node_modules/resolve/lib/core.json"(exports, module) {
    module.exports = {
      assert: true,
      "node:assert": [">= 14.18 && < 15", ">= 16"],
      "assert/strict": ">= 15",
      "node:assert/strict": ">= 16",
      async_hooks: ">= 8",
      "node:async_hooks": [">= 14.18 && < 15", ">= 16"],
      buffer_ieee754: ">= 0.5 && < 0.9.7",
      buffer: true,
      "node:buffer": [">= 14.18 && < 15", ">= 16"],
      child_process: true,
      "node:child_process": [">= 14.18 && < 15", ">= 16"],
      cluster: ">= 0.5",
      "node:cluster": [">= 14.18 && < 15", ">= 16"],
      console: true,
      "node:console": [">= 14.18 && < 15", ">= 16"],
      constants: true,
      "node:constants": [">= 14.18 && < 15", ">= 16"],
      crypto: true,
      "node:crypto": [">= 14.18 && < 15", ">= 16"],
      _debug_agent: ">= 1 && < 8",
      _debugger: "< 8",
      dgram: true,
      "node:dgram": [">= 14.18 && < 15", ">= 16"],
      diagnostics_channel: [">= 14.17 && < 15", ">= 15.1"],
      "node:diagnostics_channel": [">= 14.18 && < 15", ">= 16"],
      dns: true,
      "node:dns": [">= 14.18 && < 15", ">= 16"],
      "dns/promises": ">= 15",
      "node:dns/promises": ">= 16",
      domain: ">= 0.7.12",
      "node:domain": [">= 14.18 && < 15", ">= 16"],
      events: true,
      "node:events": [">= 14.18 && < 15", ">= 16"],
      freelist: "< 6",
      fs: true,
      "node:fs": [">= 14.18 && < 15", ">= 16"],
      "fs/promises": [">= 10 && < 10.1", ">= 14"],
      "node:fs/promises": [">= 14.18 && < 15", ">= 16"],
      _http_agent: ">= 0.11.1",
      "node:_http_agent": [">= 14.18 && < 15", ">= 16"],
      _http_client: ">= 0.11.1",
      "node:_http_client": [">= 14.18 && < 15", ">= 16"],
      _http_common: ">= 0.11.1",
      "node:_http_common": [">= 14.18 && < 15", ">= 16"],
      _http_incoming: ">= 0.11.1",
      "node:_http_incoming": [">= 14.18 && < 15", ">= 16"],
      _http_outgoing: ">= 0.11.1",
      "node:_http_outgoing": [">= 14.18 && < 15", ">= 16"],
      _http_server: ">= 0.11.1",
      "node:_http_server": [">= 14.18 && < 15", ">= 16"],
      http: true,
      "node:http": [">= 14.18 && < 15", ">= 16"],
      http2: ">= 8.8",
      "node:http2": [">= 14.18 && < 15", ">= 16"],
      https: true,
      "node:https": [">= 14.18 && < 15", ">= 16"],
      inspector: ">= 8",
      "node:inspector": [">= 14.18 && < 15", ">= 16"],
      _linklist: "< 8",
      module: true,
      "node:module": [">= 14.18 && < 15", ">= 16"],
      net: true,
      "node:net": [">= 14.18 && < 15", ">= 16"],
      "node-inspect/lib/_inspect": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
      "node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
      os: true,
      "node:os": [">= 14.18 && < 15", ">= 16"],
      path: true,
      "node:path": [">= 14.18 && < 15", ">= 16"],
      "path/posix": ">= 15.3",
      "node:path/posix": ">= 16",
      "path/win32": ">= 15.3",
      "node:path/win32": ">= 16",
      perf_hooks: ">= 8.5",
      "node:perf_hooks": [">= 14.18 && < 15", ">= 16"],
      process: ">= 1",
      "node:process": [">= 14.18 && < 15", ">= 16"],
      punycode: ">= 0.5",
      "node:punycode": [">= 14.18 && < 15", ">= 16"],
      querystring: true,
      "node:querystring": [">= 14.18 && < 15", ">= 16"],
      readline: true,
      "node:readline": [">= 14.18 && < 15", ">= 16"],
      "readline/promises": ">= 17",
      "node:readline/promises": ">= 17",
      repl: true,
      "node:repl": [">= 14.18 && < 15", ">= 16"],
      smalloc: ">= 0.11.5 && < 3",
      _stream_duplex: ">= 0.9.4",
      "node:_stream_duplex": [">= 14.18 && < 15", ">= 16"],
      _stream_transform: ">= 0.9.4",
      "node:_stream_transform": [">= 14.18 && < 15", ">= 16"],
      _stream_wrap: ">= 1.4.1",
      "node:_stream_wrap": [">= 14.18 && < 15", ">= 16"],
      _stream_passthrough: ">= 0.9.4",
      "node:_stream_passthrough": [">= 14.18 && < 15", ">= 16"],
      _stream_readable: ">= 0.9.4",
      "node:_stream_readable": [">= 14.18 && < 15", ">= 16"],
      _stream_writable: ">= 0.9.4",
      "node:_stream_writable": [">= 14.18 && < 15", ">= 16"],
      stream: true,
      "node:stream": [">= 14.18 && < 15", ">= 16"],
      "stream/consumers": ">= 16.7",
      "node:stream/consumers": ">= 16.7",
      "stream/promises": ">= 15",
      "node:stream/promises": ">= 16",
      "stream/web": ">= 16.5",
      "node:stream/web": ">= 16.5",
      string_decoder: true,
      "node:string_decoder": [">= 14.18 && < 15", ">= 16"],
      sys: [">= 0.4 && < 0.7", ">= 0.8"],
      "node:sys": [">= 14.18 && < 15", ">= 16"],
      "node:test": ">= 18",
      timers: true,
      "node:timers": [">= 14.18 && < 15", ">= 16"],
      "timers/promises": ">= 15",
      "node:timers/promises": ">= 16",
      _tls_common: ">= 0.11.13",
      "node:_tls_common": [">= 14.18 && < 15", ">= 16"],
      _tls_legacy: ">= 0.11.3 && < 10",
      _tls_wrap: ">= 0.11.3",
      "node:_tls_wrap": [">= 14.18 && < 15", ">= 16"],
      tls: true,
      "node:tls": [">= 14.18 && < 15", ">= 16"],
      trace_events: ">= 10",
      "node:trace_events": [">= 14.18 && < 15", ">= 16"],
      tty: true,
      "node:tty": [">= 14.18 && < 15", ">= 16"],
      url: true,
      "node:url": [">= 14.18 && < 15", ">= 16"],
      util: true,
      "node:util": [">= 14.18 && < 15", ">= 16"],
      "util/types": ">= 15.3",
      "node:util/types": ">= 16",
      "v8/tools/arguments": ">= 10 && < 12",
      "v8/tools/codemap": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/consarray": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/csvparser": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/logreader": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/profile_view": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      "v8/tools/splaytree": [">= 4.4 && < 5", ">= 5.2 && < 12"],
      v8: ">= 1",
      "node:v8": [">= 14.18 && < 15", ">= 16"],
      vm: true,
      "node:vm": [">= 14.18 && < 15", ">= 16"],
      wasi: ">= 13.4 && < 13.5",
      worker_threads: ">= 11.7",
      "node:worker_threads": [">= 14.18 && < 15", ">= 16"],
      zlib: ">= 0.5",
      "node:zlib": [">= 14.18 && < 15", ">= 16"]
    };
  }
});

// node_modules/resolve/lib/core.js
var require_core3 = __commonJS({
  "node_modules/resolve/lib/core.js"(exports, module) {
    var current = process.versions && process.versions.node && process.versions.node.split(".") || [];
    function specifierIncluded(specifier) {
      var parts = specifier.split(" ");
      var op = parts.length > 1 ? parts[0] : "=";
      var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".");
      for (var i = 0; i < 3; ++i) {
        var cur = parseInt(current[i] || 0, 10);
        var ver = parseInt(versionParts[i] || 0, 10);
        if (cur === ver) {
          continue;
        }
        if (op === "<") {
          return cur < ver;
        } else if (op === ">=") {
          return cur >= ver;
        }
        return false;
      }
      return op === ">=";
    }
    function matchesRange(range) {
      var specifiers = range.split(/ ?&& ?/);
      if (specifiers.length === 0) {
        return false;
      }
      for (var i = 0; i < specifiers.length; ++i) {
        if (!specifierIncluded(specifiers[i])) {
          return false;
        }
      }
      return true;
    }
    function versionIncluded(specifierValue) {
      if (typeof specifierValue === "boolean") {
        return specifierValue;
      }
      if (specifierValue && typeof specifierValue === "object") {
        for (var i = 0; i < specifierValue.length; ++i) {
          if (matchesRange(specifierValue[i])) {
            return true;
          }
        }
        return false;
      }
      return matchesRange(specifierValue);
    }
    var data = require_core2();
    var core = {};
    for (mod in data) {
      if (Object.prototype.hasOwnProperty.call(data, mod)) {
        core[mod] = versionIncluded(data[mod]);
      }
    }
    var mod;
    module.exports = core;
  }
});

// node_modules/resolve/lib/is-core.js
var require_is_core = __commonJS({
  "node_modules/resolve/lib/is-core.js"(exports, module) {
    var isCoreModule = require_is_core_module();
    module.exports = function isCore(x) {
      return isCoreModule(x);
    };
  }
});

// node_modules/resolve/lib/sync.js
var require_sync = __commonJS({
  "node_modules/resolve/lib/sync.js"(exports, module) {
    var isCore = require_is_core_module();
    var fs = require_fs();
    var path = require_path();
    var getHomedir = require_homedir();
    var caller = require_caller();
    var nodeModulesPaths = require_node_modules_paths();
    var normalizeOptions = require_normalize_options();
    var realpathFS = process.platform !== "win32" && fs.realpathSync && typeof fs.realpathSync.native === "function" ? fs.realpathSync.native : fs.realpathSync;
    var homedir = getHomedir();
    var defaultPaths = function() {
      return [
        path.join(homedir, ".node_modules"),
        path.join(homedir, ".node_libraries")
      ];
    };
    var defaultIsFile = function isFile(file) {
      try {
        var stat = fs.statSync(file, { throwIfNoEntry: false });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
          return false;
        throw e;
      }
      return !!stat && (stat.isFile() || stat.isFIFO());
    };
    var defaultIsDir = function isDirectory(dir) {
      try {
        var stat = fs.statSync(dir, { throwIfNoEntry: false });
      } catch (e) {
        if (e && (e.code === "ENOENT" || e.code === "ENOTDIR"))
          return false;
        throw e;
      }
      return !!stat && stat.isDirectory();
    };
    var defaultRealpathSync = function realpathSync(x) {
      try {
        return realpathFS(x);
      } catch (realpathErr) {
        if (realpathErr.code !== "ENOENT") {
          throw realpathErr;
        }
      }
      return x;
    };
    var maybeRealpathSync = function maybeRealpathSync2(realpathSync, x, opts) {
      if (opts && opts.preserveSymlinks === false) {
        return realpathSync(x);
      }
      return x;
    };
    var defaultReadPackageSync = function defaultReadPackageSync2(readFileSync, pkgfile) {
      var body = readFileSync(pkgfile);
      try {
        var pkg = JSON.parse(body);
        return pkg;
      } catch (jsonErr) {
      }
    };
    var getPackageCandidates = function getPackageCandidates2(x, start, opts) {
      var dirs = nodeModulesPaths(start, opts, x);
      for (var i = 0; i < dirs.length; i++) {
        dirs[i] = path.join(dirs[i], x);
      }
      return dirs;
    };
    module.exports = function resolveSync(x, options) {
      if (typeof x !== "string") {
        throw new TypeError("Path must be a string.");
      }
      var opts = normalizeOptions(x, options);
      var isFile = opts.isFile || defaultIsFile;
      var readFileSync = opts.readFileSync || fs.readFileSync;
      var isDirectory = opts.isDirectory || defaultIsDir;
      var realpathSync = opts.realpathSync || defaultRealpathSync;
      var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
      if (opts.readFileSync && opts.readPackageSync) {
        throw new TypeError("`readFileSync` and `readPackageSync` are mutually exclusive.");
      }
      var packageIterator = opts.packageIterator;
      var extensions = opts.extensions || [".js"];
      var includeCoreModules = opts.includeCoreModules !== false;
      var basedir = opts.basedir || path.dirname(caller());
      var parent = opts.filename || basedir;
      opts.paths = opts.paths || defaultPaths();
      var absoluteStart = maybeRealpathSync(realpathSync, path.resolve(basedir), opts);
      if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        var res = path.resolve(absoluteStart, x);
        if (x === "." || x === ".." || x.slice(-1) === "/")
          res += "/";
        var m = loadAsFileSync(res) || loadAsDirectorySync(res);
        if (m)
          return maybeRealpathSync(realpathSync, m, opts);
      } else if (includeCoreModules && isCore(x)) {
        return x;
      } else {
        var n = loadNodeModulesSync(x, absoluteStart);
        if (n)
          return maybeRealpathSync(realpathSync, n, opts);
      }
      var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
      err.code = "MODULE_NOT_FOUND";
      throw err;
      function loadAsFileSync(x2) {
        var pkg = loadpkg(path.dirname(x2));
        if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
          var rfile = path.relative(pkg.dir, x2);
          var r = opts.pathFilter(pkg.pkg, x2, rfile);
          if (r) {
            x2 = path.resolve(pkg.dir, r);
          }
        }
        if (isFile(x2)) {
          return x2;
        }
        for (var i = 0; i < extensions.length; i++) {
          var file = x2 + extensions[i];
          if (isFile(file)) {
            return file;
          }
        }
      }
      function loadpkg(dir) {
        if (dir === "" || dir === "/")
          return;
        if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
          return;
        }
        if (/[/\\]node_modules[/\\]*$/.test(dir))
          return;
        var pkgfile = path.join(maybeRealpathSync(realpathSync, dir, opts), "package.json");
        if (!isFile(pkgfile)) {
          return loadpkg(path.dirname(dir));
        }
        var pkg = readPackageSync(readFileSync, pkgfile);
        if (pkg && opts.packageFilter) {
          pkg = opts.packageFilter(pkg, dir);
        }
        return { pkg, dir };
      }
      function loadAsDirectorySync(x2) {
        var pkgfile = path.join(maybeRealpathSync(realpathSync, x2, opts), "/package.json");
        if (isFile(pkgfile)) {
          try {
            var pkg = readPackageSync(readFileSync, pkgfile);
          } catch (e) {
          }
          if (pkg && opts.packageFilter) {
            pkg = opts.packageFilter(pkg, x2);
          }
          if (pkg && pkg.main) {
            if (typeof pkg.main !== "string") {
              var mainError = new TypeError("package \u201C" + pkg.name + "\u201D `main` must be a string");
              mainError.code = "INVALID_PACKAGE_MAIN";
              throw mainError;
            }
            if (pkg.main === "." || pkg.main === "./") {
              pkg.main = "index";
            }
            try {
              var m2 = loadAsFileSync(path.resolve(x2, pkg.main));
              if (m2)
                return m2;
              var n2 = loadAsDirectorySync(path.resolve(x2, pkg.main));
              if (n2)
                return n2;
            } catch (e) {
            }
          }
        }
        return loadAsFileSync(path.join(x2, "/index"));
      }
      function loadNodeModulesSync(x2, start) {
        var thunk = function() {
          return getPackageCandidates(x2, start, opts);
        };
        var dirs = packageIterator ? packageIterator(x2, start, thunk, opts) : thunk();
        for (var i = 0; i < dirs.length; i++) {
          var dir = dirs[i];
          if (isDirectory(path.dirname(dir))) {
            var m2 = loadAsFileSync(dir);
            if (m2)
              return m2;
            var n2 = loadAsDirectorySync(dir);
            if (n2)
              return n2;
          }
        }
      }
    };
  }
});

// node_modules/resolve/index.js
var require_resolve = __commonJS({
  "node_modules/resolve/index.js"(exports, module) {
    var async = require_async();
    async.core = require_core3();
    async.isCore = require_is_core();
    async.sync = require_sync();
    module.exports = async;
  }
});

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;
    EventEmitter.prefixed = prefix;
    EventEmitter.EventEmitter = EventEmitter;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter;
    }
  }
});

// node_modules/p-finally/index.js
var require_p_finally = __commonJS({
  "node_modules/p-finally/index.js"(exports, module) {
    "use strict";
    module.exports = (promise, onFinally) => {
      onFinally = onFinally || (() => {
      });
      return promise.then(
        (val) => new Promise((resolve) => {
          resolve(onFinally());
        }).then(() => val),
        (err) => new Promise((resolve) => {
          resolve(onFinally());
        }).then(() => {
          throw err;
        })
      );
    };
  }
});

// node_modules/p-timeout/index.js
var require_p_timeout = __commonJS({
  "node_modules/p-timeout/index.js"(exports, module) {
    "use strict";
    var pFinally = require_p_finally();
    var TimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.name = "TimeoutError";
      }
    };
    var pTimeout = (promise, milliseconds, fallback) => new Promise((resolve, reject) => {
      if (typeof milliseconds !== "number" || milliseconds < 0) {
        throw new TypeError("Expected `milliseconds` to be a positive number");
      }
      if (milliseconds === Infinity) {
        resolve(promise);
        return;
      }
      const timer = setTimeout(() => {
        if (typeof fallback === "function") {
          try {
            resolve(fallback());
          } catch (error) {
            reject(error);
          }
          return;
        }
        const message = typeof fallback === "string" ? fallback : `Promise timed out after ${milliseconds} milliseconds`;
        const timeoutError = fallback instanceof Error ? fallback : new TimeoutError(message);
        if (typeof promise.cancel === "function") {
          promise.cancel();
        }
        reject(timeoutError);
      }, milliseconds);
      pFinally(
        promise.then(resolve, reject),
        () => {
          clearTimeout(timer);
        }
      );
    });
    module.exports = pTimeout;
    module.exports.default = pTimeout;
    module.exports.TimeoutError = TimeoutError;
  }
});

// node_modules/p-queue/dist/lower-bound.js
var require_lower_bound = __commonJS({
  "node_modules/p-queue/dist/lower-bound.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function lowerBound(array, value, comparator) {
      let first = 0;
      let count = array.length;
      while (count > 0) {
        const step = count / 2 | 0;
        let it = first + step;
        if (comparator(array[it], value) <= 0) {
          first = ++it;
          count -= step + 1;
        } else {
          count = step;
        }
      }
      return first;
    }
    exports.default = lowerBound;
  }
});

// node_modules/p-queue/dist/priority-queue.js
var require_priority_queue = __commonJS({
  "node_modules/p-queue/dist/priority-queue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var lower_bound_1 = require_lower_bound();
    var PriorityQueue = class {
      constructor() {
        this._queue = [];
      }
      enqueue(run, options) {
        options = Object.assign({ priority: 0 }, options);
        const element = {
          priority: options.priority,
          run
        };
        if (this.size && this._queue[this.size - 1].priority >= options.priority) {
          this._queue.push(element);
          return;
        }
        const index = lower_bound_1.default(this._queue, element, (a, b) => b.priority - a.priority);
        this._queue.splice(index, 0, element);
      }
      dequeue() {
        const item = this._queue.shift();
        return item === null || item === void 0 ? void 0 : item.run;
      }
      filter(options) {
        return this._queue.filter((element) => element.priority === options.priority).map((element) => element.run);
      }
      get size() {
        return this._queue.length;
      }
    };
    exports.default = PriorityQueue;
  }
});

// node_modules/p-queue/dist/index.js
var require_dist3 = __commonJS({
  "node_modules/p-queue/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventEmitter = require_eventemitter3();
    var p_timeout_1 = require_p_timeout();
    var priority_queue_1 = require_priority_queue();
    var empty = () => {
    };
    var timeoutError = new p_timeout_1.TimeoutError();
    var PQueue = class extends EventEmitter {
      constructor(options) {
        var _a, _b, _c, _d;
        super();
        this._intervalCount = 0;
        this._intervalEnd = 0;
        this._pendingCount = 0;
        this._resolveEmpty = empty;
        this._resolveIdle = empty;
        options = Object.assign({ carryoverConcurrencyCount: false, intervalCap: Infinity, interval: 0, concurrency: Infinity, autoStart: true, queueClass: priority_queue_1.default }, options);
        if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
          throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${(_b = (_a = options.intervalCap) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : ""}\` (${typeof options.intervalCap})`);
        }
        if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
          throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${(_d = (_c = options.interval) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""}\` (${typeof options.interval})`);
        }
        this._carryoverConcurrencyCount = options.carryoverConcurrencyCount;
        this._isIntervalIgnored = options.intervalCap === Infinity || options.interval === 0;
        this._intervalCap = options.intervalCap;
        this._interval = options.interval;
        this._queue = new options.queueClass();
        this._queueClass = options.queueClass;
        this.concurrency = options.concurrency;
        this._timeout = options.timeout;
        this._throwOnTimeout = options.throwOnTimeout === true;
        this._isPaused = options.autoStart === false;
      }
      get _doesIntervalAllowAnother() {
        return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
      }
      get _doesConcurrentAllowAnother() {
        return this._pendingCount < this._concurrency;
      }
      _next() {
        this._pendingCount--;
        this._tryToStartAnother();
        this.emit("next");
      }
      _resolvePromises() {
        this._resolveEmpty();
        this._resolveEmpty = empty;
        if (this._pendingCount === 0) {
          this._resolveIdle();
          this._resolveIdle = empty;
          this.emit("idle");
        }
      }
      _onResumeInterval() {
        this._onInterval();
        this._initializeIntervalIfNeeded();
        this._timeoutId = void 0;
      }
      _isIntervalPaused() {
        const now = Date.now();
        if (this._intervalId === void 0) {
          const delay = this._intervalEnd - now;
          if (delay < 0) {
            this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
          } else {
            if (this._timeoutId === void 0) {
              this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, delay);
            }
            return true;
          }
        }
        return false;
      }
      _tryToStartAnother() {
        if (this._queue.size === 0) {
          if (this._intervalId) {
            clearInterval(this._intervalId);
          }
          this._intervalId = void 0;
          this._resolvePromises();
          return false;
        }
        if (!this._isPaused) {
          const canInitializeInterval = !this._isIntervalPaused();
          if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
            const job = this._queue.dequeue();
            if (!job) {
              return false;
            }
            this.emit("active");
            job();
            if (canInitializeInterval) {
              this._initializeIntervalIfNeeded();
            }
            return true;
          }
        }
        return false;
      }
      _initializeIntervalIfNeeded() {
        if (this._isIntervalIgnored || this._intervalId !== void 0) {
          return;
        }
        this._intervalId = setInterval(() => {
          this._onInterval();
        }, this._interval);
        this._intervalEnd = Date.now() + this._interval;
      }
      _onInterval() {
        if (this._intervalCount === 0 && this._pendingCount === 0 && this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = void 0;
        }
        this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
        this._processQueue();
      }
      _processQueue() {
        while (this._tryToStartAnother()) {
        }
      }
      get concurrency() {
        return this._concurrency;
      }
      set concurrency(newConcurrency) {
        if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
          throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
        }
        this._concurrency = newConcurrency;
        this._processQueue();
      }
      async add(fn, options = {}) {
        return new Promise((resolve, reject) => {
          const run = async () => {
            this._pendingCount++;
            this._intervalCount++;
            try {
              const operation = this._timeout === void 0 && options.timeout === void 0 ? fn() : p_timeout_1.default(Promise.resolve(fn()), options.timeout === void 0 ? this._timeout : options.timeout, () => {
                if (options.throwOnTimeout === void 0 ? this._throwOnTimeout : options.throwOnTimeout) {
                  reject(timeoutError);
                }
                return void 0;
              });
              resolve(await operation);
            } catch (error) {
              reject(error);
            }
            this._next();
          };
          this._queue.enqueue(run, options);
          this._tryToStartAnother();
          this.emit("add");
        });
      }
      async addAll(functions, options) {
        return Promise.all(functions.map(async (function_) => this.add(function_, options)));
      }
      start() {
        if (!this._isPaused) {
          return this;
        }
        this._isPaused = false;
        this._processQueue();
        return this;
      }
      pause() {
        this._isPaused = true;
      }
      clear() {
        this._queue = new this._queueClass();
      }
      async onEmpty() {
        if (this._queue.size === 0) {
          return;
        }
        return new Promise((resolve) => {
          const existingResolve = this._resolveEmpty;
          this._resolveEmpty = () => {
            existingResolve();
            resolve();
          };
        });
      }
      async onIdle() {
        if (this._pendingCount === 0 && this._queue.size === 0) {
          return;
        }
        return new Promise((resolve) => {
          const existingResolve = this._resolveIdle;
          this._resolveIdle = () => {
            existingResolve();
            resolve();
          };
        });
      }
      get size() {
        return this._queue.size;
      }
      sizeBy(options) {
        return this._queue.filter(options).length;
      }
      get pending() {
        return this._pendingCount;
      }
      get isPaused() {
        return this._isPaused;
      }
      get timeout() {
        return this._timeout;
      }
      set timeout(milliseconds) {
        this._timeout = milliseconds;
      }
    };
    exports.default = PQueue;
  }
});

// node_modules/lodash.camelcase/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.camelcase/index.js"(exports, module) {
    var INFINITY = 1 / 0;
    var symbolTag = "[object Symbol]";
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f\\ufe20-\\ufe23";
    var rsComboSymbolsRange = "\\u20d0-\\u20f0";
    var rsDingbatRange = "\\u2700-\\u27bf";
    var rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
    var rsMathOpRange = "\\xac\\xb1\\xd7\\xf7";
    var rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
    var rsPunctuationRange = "\\u2000-\\u206f";
    var rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
    var rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsBreak = "[" + rsBreakRange + "]";
    var rsCombo = "[" + rsComboMarksRange + rsComboSymbolsRange + "]";
    var rsDigits = "\\d+";
    var rsDingbat = "[" + rsDingbatRange + "]";
    var rsLower = "[" + rsLowerRange + "]";
    var rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsUpper = "[" + rsUpperRange + "]";
    var rsZWJ = "\\u200d";
    var rsLowerMisc = "(?:" + rsLower + "|" + rsMisc + ")";
    var rsUpperMisc = "(?:" + rsUpper + "|" + rsMisc + ")";
    var rsOptLowerContr = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?";
    var rsOptUpperContr = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptLowerContr + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsUpperMisc + "+" + rsOptUpperContr + "(?=" + [rsBreak, rsUpper + rsLowerMisc, "$"].join("|") + ")",
      rsUpper + "?" + rsLowerMisc + "+" + rsOptLowerContr,
      rsUpper + "+" + rsOptUpperContr,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var deburredLetters = {
      "\xC0": "A",
      "\xC1": "A",
      "\xC2": "A",
      "\xC3": "A",
      "\xC4": "A",
      "\xC5": "A",
      "\xE0": "a",
      "\xE1": "a",
      "\xE2": "a",
      "\xE3": "a",
      "\xE4": "a",
      "\xE5": "a",
      "\xC7": "C",
      "\xE7": "c",
      "\xD0": "D",
      "\xF0": "d",
      "\xC8": "E",
      "\xC9": "E",
      "\xCA": "E",
      "\xCB": "E",
      "\xE8": "e",
      "\xE9": "e",
      "\xEA": "e",
      "\xEB": "e",
      "\xCC": "I",
      "\xCD": "I",
      "\xCE": "I",
      "\xCF": "I",
      "\xEC": "i",
      "\xED": "i",
      "\xEE": "i",
      "\xEF": "i",
      "\xD1": "N",
      "\xF1": "n",
      "\xD2": "O",
      "\xD3": "O",
      "\xD4": "O",
      "\xD5": "O",
      "\xD6": "O",
      "\xD8": "O",
      "\xF2": "o",
      "\xF3": "o",
      "\xF4": "o",
      "\xF5": "o",
      "\xF6": "o",
      "\xF8": "o",
      "\xD9": "U",
      "\xDA": "U",
      "\xDB": "U",
      "\xDC": "U",
      "\xF9": "u",
      "\xFA": "u",
      "\xFB": "u",
      "\xFC": "u",
      "\xDD": "Y",
      "\xFD": "y",
      "\xFF": "y",
      "\xC6": "Ae",
      "\xE6": "ae",
      "\xDE": "Th",
      "\xFE": "th",
      "\xDF": "ss",
      "\u0100": "A",
      "\u0102": "A",
      "\u0104": "A",
      "\u0101": "a",
      "\u0103": "a",
      "\u0105": "a",
      "\u0106": "C",
      "\u0108": "C",
      "\u010A": "C",
      "\u010C": "C",
      "\u0107": "c",
      "\u0109": "c",
      "\u010B": "c",
      "\u010D": "c",
      "\u010E": "D",
      "\u0110": "D",
      "\u010F": "d",
      "\u0111": "d",
      "\u0112": "E",
      "\u0114": "E",
      "\u0116": "E",
      "\u0118": "E",
      "\u011A": "E",
      "\u0113": "e",
      "\u0115": "e",
      "\u0117": "e",
      "\u0119": "e",
      "\u011B": "e",
      "\u011C": "G",
      "\u011E": "G",
      "\u0120": "G",
      "\u0122": "G",
      "\u011D": "g",
      "\u011F": "g",
      "\u0121": "g",
      "\u0123": "g",
      "\u0124": "H",
      "\u0126": "H",
      "\u0125": "h",
      "\u0127": "h",
      "\u0128": "I",
      "\u012A": "I",
      "\u012C": "I",
      "\u012E": "I",
      "\u0130": "I",
      "\u0129": "i",
      "\u012B": "i",
      "\u012D": "i",
      "\u012F": "i",
      "\u0131": "i",
      "\u0134": "J",
      "\u0135": "j",
      "\u0136": "K",
      "\u0137": "k",
      "\u0138": "k",
      "\u0139": "L",
      "\u013B": "L",
      "\u013D": "L",
      "\u013F": "L",
      "\u0141": "L",
      "\u013A": "l",
      "\u013C": "l",
      "\u013E": "l",
      "\u0140": "l",
      "\u0142": "l",
      "\u0143": "N",
      "\u0145": "N",
      "\u0147": "N",
      "\u014A": "N",
      "\u0144": "n",
      "\u0146": "n",
      "\u0148": "n",
      "\u014B": "n",
      "\u014C": "O",
      "\u014E": "O",
      "\u0150": "O",
      "\u014D": "o",
      "\u014F": "o",
      "\u0151": "o",
      "\u0154": "R",
      "\u0156": "R",
      "\u0158": "R",
      "\u0155": "r",
      "\u0157": "r",
      "\u0159": "r",
      "\u015A": "S",
      "\u015C": "S",
      "\u015E": "S",
      "\u0160": "S",
      "\u015B": "s",
      "\u015D": "s",
      "\u015F": "s",
      "\u0161": "s",
      "\u0162": "T",
      "\u0164": "T",
      "\u0166": "T",
      "\u0163": "t",
      "\u0165": "t",
      "\u0167": "t",
      "\u0168": "U",
      "\u016A": "U",
      "\u016C": "U",
      "\u016E": "U",
      "\u0170": "U",
      "\u0172": "U",
      "\u0169": "u",
      "\u016B": "u",
      "\u016D": "u",
      "\u016F": "u",
      "\u0171": "u",
      "\u0173": "u",
      "\u0174": "W",
      "\u0175": "w",
      "\u0176": "Y",
      "\u0177": "y",
      "\u0178": "Y",
      "\u0179": "Z",
      "\u017B": "Z",
      "\u017D": "Z",
      "\u017A": "z",
      "\u017C": "z",
      "\u017E": "z",
      "\u0132": "IJ",
      "\u0133": "ij",
      "\u0152": "Oe",
      "\u0153": "oe",
      "\u0149": "'n",
      "\u017F": "ss"
    };
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array ? array.length : 0;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? void 0 : object[key];
      };
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var Symbol2 = root.Symbol;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);
        var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
        var chr = strSymbols ? strSymbols[0] : string.charAt(0);
        var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
        return chr[methodName]() + trailing;
      };
    }
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
      };
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? capitalize(word) : word);
    });
    function capitalize(string) {
      return upperFirst(toString(string).toLowerCase());
    }
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
    }
    var upperFirst = createCaseFirst("toUpperCase");
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? void 0 : pattern;
      if (pattern === void 0) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }
    module.exports = camelCase;
  }
});

// node_modules/loader-utils/lib/hash/wasm-hash.js
var require_wasm_hash = __commonJS({
  "node_modules/loader-utils/lib/hash/wasm-hash.js"(exports, module) {
    "use strict";
    var MAX_SHORT_STRING = Math.floor((65536 - 64) / 4) & ~3;
    var WasmHash = class {
      constructor(instance, instancesPool, chunkSize, digestSize) {
        const exports2 = instance.exports;
        exports2.init();
        this.exports = exports2;
        this.mem = Buffer.from(exports2.memory.buffer, 0, 65536);
        this.buffered = 0;
        this.instancesPool = instancesPool;
        this.chunkSize = chunkSize;
        this.digestSize = digestSize;
      }
      reset() {
        this.buffered = 0;
        this.exports.init();
      }
      update(data, encoding) {
        if (typeof data === "string") {
          while (data.length > MAX_SHORT_STRING) {
            this._updateWithShortString(data.slice(0, MAX_SHORT_STRING), encoding);
            data = data.slice(MAX_SHORT_STRING);
          }
          this._updateWithShortString(data, encoding);
          return this;
        }
        this._updateWithBuffer(data);
        return this;
      }
      _updateWithShortString(data, encoding) {
        const { exports: exports2, buffered, mem, chunkSize } = this;
        let endPos;
        if (data.length < 70) {
          if (!encoding || encoding === "utf-8" || encoding === "utf8") {
            endPos = buffered;
            for (let i = 0; i < data.length; i++) {
              const cc = data.charCodeAt(i);
              if (cc < 128) {
                mem[endPos++] = cc;
              } else if (cc < 2048) {
                mem[endPos] = cc >> 6 | 192;
                mem[endPos + 1] = cc & 63 | 128;
                endPos += 2;
              } else {
                endPos += mem.write(data.slice(i), endPos, encoding);
                break;
              }
            }
          } else if (encoding === "latin1") {
            endPos = buffered;
            for (let i = 0; i < data.length; i++) {
              const cc = data.charCodeAt(i);
              mem[endPos++] = cc;
            }
          } else {
            endPos = buffered + mem.write(data, buffered, encoding);
          }
        } else {
          endPos = buffered + mem.write(data, buffered, encoding);
        }
        if (endPos < chunkSize) {
          this.buffered = endPos;
        } else {
          const l = endPos & ~(this.chunkSize - 1);
          exports2.update(l);
          const newBuffered = endPos - l;
          this.buffered = newBuffered;
          if (newBuffered > 0) {
            mem.copyWithin(0, l, endPos);
          }
        }
      }
      _updateWithBuffer(data) {
        const { exports: exports2, buffered, mem } = this;
        const length = data.length;
        if (buffered + length < this.chunkSize) {
          data.copy(mem, buffered, 0, length);
          this.buffered += length;
        } else {
          const l = buffered + length & ~(this.chunkSize - 1);
          if (l > 65536) {
            let i = 65536 - buffered;
            data.copy(mem, buffered, 0, i);
            exports2.update(65536);
            const stop = l - buffered - 65536;
            while (i < stop) {
              data.copy(mem, 0, i, i + 65536);
              exports2.update(65536);
              i += 65536;
            }
            data.copy(mem, 0, i, l - buffered);
            exports2.update(l - buffered - i);
          } else {
            data.copy(mem, buffered, 0, l - buffered);
            exports2.update(l);
          }
          const newBuffered = length + buffered - l;
          this.buffered = newBuffered;
          if (newBuffered > 0) {
            data.copy(mem, 0, length - newBuffered, length);
          }
        }
      }
      digest(type) {
        const { exports: exports2, buffered, mem, digestSize } = this;
        exports2.final(buffered);
        this.instancesPool.push(this);
        const hex = mem.toString("latin1", 0, digestSize);
        if (type === "hex") {
          return hex;
        }
        if (type === "binary" || !type) {
          return Buffer.from(hex, "hex");
        }
        return Buffer.from(hex, "hex").toString(type);
      }
    };
    var create = (wasmModule, instancesPool, chunkSize, digestSize) => {
      if (instancesPool.length > 0) {
        const old = instancesPool.pop();
        old.reset();
        return old;
      } else {
        return new WasmHash(
          new WebAssembly.Instance(wasmModule),
          instancesPool,
          chunkSize,
          digestSize
        );
      }
    };
    module.exports = create;
    module.exports.MAX_SHORT_STRING = MAX_SHORT_STRING;
  }
});

// node_modules/loader-utils/lib/hash/xxhash64.js
var require_xxhash64 = __commonJS({
  "node_modules/loader-utils/lib/hash/xxhash64.js"(exports, module) {
    "use strict";
    var create = require_wasm_hash();
    var xxhash64 = new WebAssembly.Module(
      Buffer.from(
        "AGFzbQEAAAABCAJgAX8AYAAAAwQDAQAABQMBAAEGGgV+AUIAC34BQgALfgFCAAt+AUIAC34BQgALByIEBGluaXQAAAZ1cGRhdGUAAQVmaW5hbAACBm1lbW9yeQIACrUIAzAAQtbrgu7q/Yn14AAkAELP1tO+0ser2UIkAUIAJAJC+erQ0OfJoeThACQDQgAkBAvUAQIBfwR+IABFBEAPCyMEIACtfCQEIwAhAiMBIQMjAiEEIwMhBQNAIAIgASkDAELP1tO+0ser2UJ+fEIfiUKHla+vmLbem55/fiECIAMgASkDCELP1tO+0ser2UJ+fEIfiUKHla+vmLbem55/fiEDIAQgASkDEELP1tO+0ser2UJ+fEIfiUKHla+vmLbem55/fiEEIAUgASkDGELP1tO+0ser2UJ+fEIfiUKHla+vmLbem55/fiEFIAAgAUEgaiIBSw0ACyACJAAgAyQBIAQkAiAFJAMLqwYCAX8EfiMEQgBSBH4jACICQgGJIwEiA0IHiXwjAiIEQgyJfCMDIgVCEol8IAJCz9bTvtLHq9lCfkIfiUKHla+vmLbem55/foVCh5Wvr5i23puef35CnaO16oOxjYr6AH0gA0LP1tO+0ser2UJ+Qh+JQoeVr6+Ytt6bnn9+hUKHla+vmLbem55/fkKdo7Xqg7GNivoAfSAEQs/W077Sx6vZQn5CH4lCh5Wvr5i23puef36FQoeVr6+Ytt6bnn9+Qp2jteqDsY2K+gB9IAVCz9bTvtLHq9lCfkIfiUKHla+vmLbem55/foVCh5Wvr5i23puef35CnaO16oOxjYr6AH0FQsXP2bLx5brqJwsjBCAArXx8IQIDQCABQQhqIABNBEAgAiABKQMAQs/W077Sx6vZQn5CH4lCh5Wvr5i23puef36FQhuJQoeVr6+Ytt6bnn9+Qp2jteqDsY2K+gB9IQIgAUEIaiEBDAELCyABQQRqIABNBEACfyACIAE1AgBCh5Wvr5i23puef36FQheJQs/W077Sx6vZQn5C+fPd8Zn2masWfCECIAFBBGoLIQELA0AgACABRwRAIAIgATEAAELFz9my8eW66id+hUILiUKHla+vmLbem55/fiECIAFBAWohAQwBCwtBACACIAJCIYiFQs/W077Sx6vZQn4iAiACQh2IhUL5893xmfaZqxZ+IgIgAkIgiIUiAkIgiCIDQv//A4NCIIYgA0KAgPz/D4NCEIiEIgNC/4GAgPAfg0IQhiADQoD+g4CA4D+DQgiIhCIDQo+AvIDwgcAHg0IIhiADQvCBwIeAnoD4AINCBIiEIgNChoyYsODAgYMGfEIEiEKBgoSIkKDAgAGDQid+IANCsODAgYOGjJgwhHw3AwBBCCACQv////8PgyICQv//A4NCIIYgAkKAgPz/D4NCEIiEIgJC/4GAgPAfg0IQhiACQoD+g4CA4D+DQgiIhCICQo+AvIDwgcAHg0IIhiACQvCBwIeAnoD4AINCBIiEIgJChoyYsODAgYMGfEIEiEKBgoSIkKDAgAGDQid+IAJCsODAgYOGjJgwhHw3AwAL",
        "base64"
      )
    );
    module.exports = create.bind(null, xxhash64, [], 32, 16);
  }
});

// node_modules/loader-utils/lib/hash/BatchedHash.js
var require_BatchedHash = __commonJS({
  "node_modules/loader-utils/lib/hash/BatchedHash.js"(exports, module) {
    var MAX_SHORT_STRING = require_wasm_hash().MAX_SHORT_STRING;
    var BatchedHash = class {
      constructor(hash) {
        this.string = void 0;
        this.encoding = void 0;
        this.hash = hash;
      }
      update(data, inputEncoding) {
        if (this.string !== void 0) {
          if (typeof data === "string" && inputEncoding === this.encoding && this.string.length + data.length < MAX_SHORT_STRING) {
            this.string += data;
            return this;
          }
          this.hash.update(this.string, this.encoding);
          this.string = void 0;
        }
        if (typeof data === "string") {
          if (data.length < MAX_SHORT_STRING && (!inputEncoding || !inputEncoding.startsWith("ba"))) {
            this.string = data;
            this.encoding = inputEncoding;
          } else {
            this.hash.update(data, inputEncoding);
          }
        } else {
          this.hash.update(data);
        }
        return this;
      }
      digest(encoding) {
        if (this.string !== void 0) {
          this.hash.update(this.string, this.encoding);
        }
        return this.hash.digest(encoding);
      }
    };
    module.exports = BatchedHash;
  }
});

// node_modules/loader-utils/lib/hash/md4.js
var require_md4 = __commonJS({
  "node_modules/loader-utils/lib/hash/md4.js"(exports, module) {
    "use strict";
    var create = require_wasm_hash();
    var md4 = new WebAssembly.Module(
      Buffer.from(
        "AGFzbQEAAAABCAJgAX8AYAAAAwUEAQAAAAUDAQABBhoFfwFBAAt/AUEAC38BQQALfwFBAAt/AUEACwciBARpbml0AAAGdXBkYXRlAAIFZmluYWwAAwZtZW1vcnkCAAqFEAQmAEGBxpS6BiQBQYnXtv5+JAJB/rnrxXkkA0H2qMmBASQEQQAkAAvMCgEYfyMBIQojAiEGIwMhByMEIQgDQCAAIAVLBEAgBSgCCCINIAcgBiAFKAIEIgsgCCAHIAUoAgAiDCAKIAggBiAHIAhzcXNqakEDdyIDIAYgB3Nxc2pqQQd3IgEgAyAGc3FzampBC3chAiAFKAIUIg8gASACIAUoAhAiCSADIAEgBSgCDCIOIAYgAyACIAEgA3Nxc2pqQRN3IgQgASACc3FzampBA3ciAyACIARzcXNqakEHdyEBIAUoAiAiEiADIAEgBSgCHCIRIAQgAyAFKAIYIhAgAiAEIAEgAyAEc3FzampBC3ciAiABIANzcXNqakETdyIEIAEgAnNxc2pqQQN3IQMgBSgCLCIVIAQgAyAFKAIoIhQgAiAEIAUoAiQiEyABIAIgAyACIARzcXNqakEHdyIBIAMgBHNxc2pqQQt3IgIgASADc3FzampBE3chBCAPIBAgCSAVIBQgEyAFKAI4IhYgAiAEIAUoAjQiFyABIAIgBSgCMCIYIAMgASAEIAEgAnNxc2pqQQN3IgEgAiAEc3FzampBB3ciAiABIARzcXNqakELdyIDIAkgAiAMIAEgBSgCPCIJIAQgASADIAEgAnNxc2pqQRN3IgEgAiADcnEgAiADcXJqakGZ84nUBWpBA3ciAiABIANycSABIANxcmpqQZnzidQFakEFdyIEIAEgAnJxIAEgAnFyaiASakGZ84nUBWpBCXciAyAPIAQgCyACIBggASADIAIgBHJxIAIgBHFyampBmfOJ1AVqQQ13IgEgAyAEcnEgAyAEcXJqakGZ84nUBWpBA3ciAiABIANycSABIANxcmpqQZnzidQFakEFdyIEIAEgAnJxIAEgAnFyampBmfOJ1AVqQQl3IgMgECAEIAIgFyABIAMgAiAEcnEgAiAEcXJqakGZ84nUBWpBDXciASADIARycSADIARxcmogDWpBmfOJ1AVqQQN3IgIgASADcnEgASADcXJqakGZ84nUBWpBBXciBCABIAJycSABIAJxcmpqQZnzidQFakEJdyIDIBEgBCAOIAIgFiABIAMgAiAEcnEgAiAEcXJqakGZ84nUBWpBDXciASADIARycSADIARxcmpqQZnzidQFakEDdyICIAEgA3JxIAEgA3FyampBmfOJ1AVqQQV3IgQgASACcnEgASACcXJqakGZ84nUBWpBCXciAyAMIAIgAyAJIAEgAyACIARycSACIARxcmpqQZnzidQFakENdyIBcyAEc2pqQaHX5/YGakEDdyICIAQgASACcyADc2ogEmpBodfn9gZqQQl3IgRzIAFzampBodfn9gZqQQt3IgMgAiADIBggASADIARzIAJzampBodfn9gZqQQ93IgFzIARzaiANakGh1+f2BmpBA3ciAiAUIAQgASACcyADc2pqQaHX5/YGakEJdyIEcyABc2pqQaHX5/YGakELdyIDIAsgAiADIBYgASADIARzIAJzampBodfn9gZqQQ93IgFzIARzampBodfn9gZqQQN3IgIgEyAEIAEgAnMgA3NqakGh1+f2BmpBCXciBHMgAXNqakGh1+f2BmpBC3chAyAKIA4gAiADIBcgASADIARzIAJzampBodfn9gZqQQ93IgFzIARzampBodfn9gZqQQN3IgJqIQogBiAJIAEgESADIAIgFSAEIAEgAnMgA3NqakGh1+f2BmpBCXciBHMgAXNqakGh1+f2BmpBC3ciAyAEcyACc2pqQaHX5/YGakEPd2ohBiADIAdqIQcgBCAIaiEIIAVBQGshBQwBCwsgCiQBIAYkAiAHJAMgCCQECw0AIAAQASMAIABqJAAL/wQCA38BfiMAIABqrUIDhiEEIABByABqQUBxIgJBCGshAyAAIgFBAWohACABQYABOgAAA0AgACACSUEAIABBB3EbBEAgAEEAOgAAIABBAWohAAwBCwsDQCAAIAJJBEAgAEIANwMAIABBCGohAAwBCwsgAyAENwMAIAIQAUEAIwGtIgRC//8DgyAEQoCA/P8Pg0IQhoQiBEL/gYCA8B+DIARCgP6DgIDgP4NCCIaEIgRCj4C8gPCBwAeDQgiGIARC8IHAh4CegPgAg0IEiIQiBEKGjJiw4MCBgwZ8QgSIQoGChIiQoMCAAYNCJ34gBEKw4MCBg4aMmDCEfDcDAEEIIwKtIgRC//8DgyAEQoCA/P8Pg0IQhoQiBEL/gYCA8B+DIARCgP6DgIDgP4NCCIaEIgRCj4C8gPCBwAeDQgiGIARC8IHAh4CegPgAg0IEiIQiBEKGjJiw4MCBgwZ8QgSIQoGChIiQoMCAAYNCJ34gBEKw4MCBg4aMmDCEfDcDAEEQIwOtIgRC//8DgyAEQoCA/P8Pg0IQhoQiBEL/gYCA8B+DIARCgP6DgIDgP4NCCIaEIgRCj4C8gPCBwAeDQgiGIARC8IHAh4CegPgAg0IEiIQiBEKGjJiw4MCBgwZ8QgSIQoGChIiQoMCAAYNCJ34gBEKw4MCBg4aMmDCEfDcDAEEYIwStIgRC//8DgyAEQoCA/P8Pg0IQhoQiBEL/gYCA8B+DIARCgP6DgIDgP4NCCIaEIgRCj4C8gPCBwAeDQgiGIARC8IHAh4CegPgAg0IEiIQiBEKGjJiw4MCBgwZ8QgSIQoGChIiQoMCAAYNCJ34gBEKw4MCBg4aMmDCEfDcDAAs=",
        "base64"
      )
    );
    module.exports = create.bind(null, md4, [], 64, 32);
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          throw new Error(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code.`);
        }
      }
    }));
  }
});

// node_modules/loader-utils/lib/hash/BulkUpdateDecorator.js
var require_BulkUpdateDecorator = __commonJS({
  "node_modules/loader-utils/lib/hash/BulkUpdateDecorator.js"(exports, module) {
    var BULK_SIZE = 2e3;
    var digestCaches = {};
    var BulkUpdateDecorator = class {
      constructor(hashOrFactory, hashKey) {
        this.hashKey = hashKey;
        if (typeof hashOrFactory === "function") {
          this.hashFactory = hashOrFactory;
          this.hash = void 0;
        } else {
          this.hashFactory = void 0;
          this.hash = hashOrFactory;
        }
        this.buffer = "";
      }
      update(data, inputEncoding) {
        if (inputEncoding !== void 0 || typeof data !== "string" || data.length > BULK_SIZE) {
          if (this.hash === void 0) {
            this.hash = this.hashFactory();
          }
          if (this.buffer.length > 0) {
            this.hash.update(this.buffer);
            this.buffer = "";
          }
          this.hash.update(data, inputEncoding);
        } else {
          this.buffer += data;
          if (this.buffer.length > BULK_SIZE) {
            if (this.hash === void 0) {
              this.hash = this.hashFactory();
            }
            this.hash.update(this.buffer);
            this.buffer = "";
          }
        }
        return this;
      }
      digest(encoding) {
        let digestCache;
        const buffer = this.buffer;
        if (this.hash === void 0) {
          const cacheKey = `${this.hashKey}-${encoding}`;
          digestCache = digestCaches[cacheKey];
          if (digestCache === void 0) {
            digestCache = digestCaches[cacheKey] = /* @__PURE__ */ new Map();
          }
          const cacheEntry = digestCache.get(buffer);
          if (cacheEntry !== void 0) {
            return cacheEntry;
          }
          this.hash = this.hashFactory();
        }
        if (buffer.length > 0) {
          this.hash.update(buffer);
        }
        const digestResult = this.hash.digest(encoding);
        if (digestCache !== void 0) {
          digestCache.set(buffer, digestResult);
        }
        return digestResult;
      }
    };
    module.exports = BulkUpdateDecorator;
  }
});

// node_modules/loader-utils/lib/getHashDigest.js
var require_getHashDigest = __commonJS({
  "node_modules/loader-utils/lib/getHashDigest.js"(exports, module) {
    "use strict";
    var baseEncodeTables = {
      26: "abcdefghijklmnopqrstuvwxyz",
      32: "123456789abcdefghjkmnpqrstuvwxyz",
      36: "0123456789abcdefghijklmnopqrstuvwxyz",
      49: "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
      52: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      58: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
      62: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
      64: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
    };
    function divmod32(uint32Array, divisor) {
      let carry = 0;
      for (let i = uint32Array.length - 1; i >= 0; i--) {
        const value = carry * 4294967296 + uint32Array[i];
        carry = value % divisor;
        uint32Array[i] = Math.floor(value / divisor);
      }
      return carry;
    }
    function encodeBufferToBase(buffer, base, length) {
      const encodeTable = baseEncodeTables[base];
      if (!encodeTable) {
        throw new Error("Unknown encoding base" + base);
      }
      const limit = Math.ceil(buffer.length * 8 / Math.log2(base));
      length = Math.min(length, limit);
      const uint32Array = new Uint32Array(Math.ceil(buffer.length / 4));
      buffer.copy(Buffer.from(uint32Array.buffer));
      let output = "";
      for (let i = 0; i < length; i++) {
        output = encodeTable[divmod32(uint32Array, base)] + output;
      }
      return output;
    }
    var crypto = void 0;
    var createXXHash64 = void 0;
    var createMd4 = void 0;
    var BatchedHash = void 0;
    var BulkUpdateDecorator = void 0;
    function getHashDigest(buffer, algorithm, digestType, maxLength) {
      algorithm = algorithm || "xxhash64";
      maxLength = maxLength || 9999;
      let hash;
      if (algorithm === "xxhash64") {
        if (createXXHash64 === void 0) {
          createXXHash64 = require_xxhash64();
          if (BatchedHash === void 0) {
            BatchedHash = require_BatchedHash();
          }
        }
        hash = new BatchedHash(createXXHash64());
      } else if (algorithm === "md4") {
        if (createMd4 === void 0) {
          createMd4 = require_md4();
          if (BatchedHash === void 0) {
            BatchedHash = require_BatchedHash();
          }
        }
        hash = new BatchedHash(createMd4());
      } else if (algorithm === "native-md4") {
        if (typeof crypto === "undefined") {
          crypto = require_crypto();
          if (BulkUpdateDecorator === void 0) {
            BulkUpdateDecorator = require_BulkUpdateDecorator();
          }
        }
        hash = new BulkUpdateDecorator(() => crypto.createHash("md4"), "md4");
      } else {
        if (typeof crypto === "undefined") {
          crypto = require_crypto();
          if (BulkUpdateDecorator === void 0) {
            BulkUpdateDecorator = require_BulkUpdateDecorator();
          }
        }
        hash = new BulkUpdateDecorator(
          () => crypto.createHash(algorithm),
          algorithm
        );
      }
      hash.update(buffer);
      if (digestType === "base26" || digestType === "base32" || digestType === "base36" || digestType === "base49" || digestType === "base52" || digestType === "base58" || digestType === "base62") {
        return encodeBufferToBase(hash.digest(), digestType.substr(4), maxLength);
      } else {
        return hash.digest(digestType || "hex").substr(0, maxLength);
      }
    }
    module.exports = getHashDigest;
  }
});

// node_modules/loader-utils/lib/interpolateName.js
var require_interpolateName = __commonJS({
  "node_modules/loader-utils/lib/interpolateName.js"(exports, module) {
    "use strict";
    var path = require_path();
    var getHashDigest = require_getHashDigest();
    function interpolateName(loaderContext, name, options = {}) {
      let filename;
      const hasQuery = loaderContext.resourceQuery && loaderContext.resourceQuery.length > 1;
      if (typeof name === "function") {
        filename = name(
          loaderContext.resourcePath,
          hasQuery ? loaderContext.resourceQuery : void 0
        );
      } else {
        filename = name || "[hash].[ext]";
      }
      const context = options.context;
      const content = options.content;
      const regExp = options.regExp;
      let ext = "bin";
      let basename = "file";
      let directory = "";
      let folder = "";
      let query = "";
      if (loaderContext.resourcePath) {
        const parsed = path.parse(loaderContext.resourcePath);
        let resourcePath = loaderContext.resourcePath;
        if (parsed.ext) {
          ext = parsed.ext.substr(1);
        }
        if (parsed.dir) {
          basename = parsed.name;
          resourcePath = parsed.dir + path.sep;
        }
        if (typeof context !== "undefined") {
          directory = path.relative(context, resourcePath + "_").replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1");
          directory = directory.substr(0, directory.length - 1);
        } else {
          directory = resourcePath.replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1");
        }
        if (directory.length === 1) {
          directory = "";
        } else if (directory.length > 1) {
          folder = path.basename(directory);
        }
      }
      if (loaderContext.resourceQuery && loaderContext.resourceQuery.length > 1) {
        query = loaderContext.resourceQuery;
        const hashIdx = query.indexOf("#");
        if (hashIdx >= 0) {
          query = query.substr(0, hashIdx);
        }
      }
      let url = filename;
      if (content) {
        url = url.replace(
          /\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
          (all, hashType, digestType, maxLength) => getHashDigest(content, hashType, digestType, parseInt(maxLength, 10))
        );
      }
      url = url.replace(/\[ext\]/gi, () => ext).replace(/\[name\]/gi, () => basename).replace(/\[path\]/gi, () => directory).replace(/\[folder\]/gi, () => folder).replace(/\[query\]/gi, () => query);
      if (regExp && loaderContext.resourcePath) {
        const match = loaderContext.resourcePath.match(new RegExp(regExp));
        match && match.forEach((matched, i) => {
          url = url.replace(new RegExp("\\[" + i + "\\]", "ig"), matched);
        });
      }
      if (typeof loaderContext.options === "object" && typeof loaderContext.options.customInterpolateName === "function") {
        url = loaderContext.options.customInterpolateName.call(
          loaderContext,
          url,
          name,
          options
        );
      }
      return url;
    }
    module.exports = interpolateName;
  }
});

// node_modules/generic-names/index.js
var require_generic_names = __commonJS({
  "node_modules/generic-names/index.js"(exports, module) {
    "use strict";
    var interpolateName = require_interpolateName();
    var path = require_path();
    module.exports = function createGenerator(pattern, options) {
      options = options || {};
      var context = options && typeof options.context === "string" ? options.context : process.cwd();
      var hashPrefix = options && typeof options.hashPrefix === "string" ? options.hashPrefix : "";
      return function generate(localName, filepath) {
        var name = pattern.replace(/\[local\]/gi, localName);
        var loaderContext = {
          resourcePath: filepath
        };
        var loaderOptions = {
          content: hashPrefix + path.relative(context, filepath).replace(/\\/g, "/") + "\0" + localName,
          context
        };
        var genericName = interpolateName(loaderContext, name, loaderOptions);
        return genericName.replace(new RegExp("[^a-zA-Z0-9\\-_\xA0-\uFFFF]", "g"), "-").replace(/^((-?[0-9])|--)/, "_$1");
      };
    };
  }
});

// node_modules/postcss-modules/build/unquote/index.js
var require_unquote = __commonJS({
  "node_modules/postcss-modules/build/unquote/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = unquote;
    var reg = /['"]/;
    function unquote(str) {
      if (!str) {
        return "";
      }
      if (reg.test(str.charAt(0))) {
        str = str.substr(1);
      }
      if (reg.test(str.charAt(str.length - 1))) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    }
  }
});

// node_modules/icss-replace-symbols/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/icss-replace-symbols/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.replaceAll = replaceAll;
    var matchConstName = /[$#]?[\w-\.]+/g;
    function replaceAll(replacements, text) {
      var matches = void 0;
      while (matches = matchConstName.exec(text)) {
        var replacement = replacements[matches[0]];
        if (replacement) {
          text = text.slice(0, matches.index) + replacement + text.slice(matchConstName.lastIndex);
          matchConstName.lastIndex -= matches[0].length - replacement.length;
        }
      }
      return text;
    }
    exports.default = function(css, translations) {
      css.walkDecls(function(decl) {
        return decl.value = replaceAll(translations, decl.value);
      });
      css.walkAtRules("media", function(atRule) {
        return atRule.params = replaceAll(translations, atRule.params);
      });
    };
  }
});

// node_modules/postcss-modules/build/css-loader-core/parser.js
var require_parser = __commonJS({
  "node_modules/postcss-modules/build/css-loader-core/parser.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _icssReplaceSymbols = require_lib2();
    var _icssReplaceSymbols2 = _interopRequireDefault(_icssReplaceSymbols);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var importRegexp = /^:import\((.+)\)$/;
    var Parser = class {
      constructor(pathFetcher, trace) {
        this.pathFetcher = pathFetcher;
        this.plugin = this.plugin.bind(this);
        this.exportTokens = {};
        this.translations = {};
        this.trace = trace;
      }
      plugin() {
        const parser = this;
        return {
          postcssPlugin: "css-modules-parser",
          OnceExit(css) {
            return Promise.all(parser.fetchAllImports(css)).then(() => parser.linkImportedSymbols(css)).then(() => parser.extractExports(css));
          }
        };
      }
      fetchAllImports(css) {
        let imports = [];
        css.each((node) => {
          if (node.type == "rule" && node.selector.match(importRegexp)) {
            imports.push(this.fetchImport(node, css.source.input.from, imports.length));
          }
        });
        return imports;
      }
      linkImportedSymbols(css) {
        (0, _icssReplaceSymbols2.default)(css, this.translations);
      }
      extractExports(css) {
        css.each((node) => {
          if (node.type == "rule" && node.selector == ":export")
            this.handleExport(node);
        });
      }
      handleExport(exportNode) {
        exportNode.each((decl) => {
          if (decl.type == "decl") {
            Object.keys(this.translations).forEach((translation) => {
              decl.value = decl.value.replace(translation, this.translations[translation]);
            });
            this.exportTokens[decl.prop] = decl.value;
          }
        });
        exportNode.remove();
      }
      fetchImport(importNode, relativeTo, depNr) {
        let file = importNode.selector.match(importRegexp)[1], depTrace = this.trace + String.fromCharCode(depNr);
        return this.pathFetcher(file, relativeTo, depTrace).then((exports2) => {
          importNode.each((decl) => {
            if (decl.type == "decl") {
              this.translations[decl.prop] = exports2[decl.value];
            }
          });
          importNode.remove();
        }, (err) => console.log(err));
      }
    };
    exports.default = Parser;
  }
});

// node_modules/postcss-modules/build/css-loader-core/loader.js
var require_loader = __commonJS({
  "node_modules/postcss-modules/build/css-loader-core/loader.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _postcss = require_postcss();
    var _postcss2 = _interopRequireDefault(_postcss);
    var _fs = require_fs();
    var _fs2 = _interopRequireDefault(_fs);
    var _path = require_path();
    var _path2 = _interopRequireDefault(_path);
    var _parser = require_parser();
    var _parser2 = _interopRequireDefault(_parser);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var Core = class {
      constructor(plugins) {
        this.plugins = plugins || Core.defaultPlugins;
      }
      load(sourceString, sourcePath, trace, pathFetcher) {
        let parser = new _parser2.default(pathFetcher, trace);
        return (0, _postcss2.default)(this.plugins.concat([parser.plugin()])).process(sourceString, { from: "/" + sourcePath }).then((result) => {
          return {
            injectableSource: result.css,
            exportTokens: parser.exportTokens
          };
        });
      }
    };
    var traceKeySorter = (a, b) => {
      if (a.length < b.length) {
        return a < b.substring(0, a.length) ? -1 : 1;
      } else if (a.length > b.length) {
        return a.substring(0, b.length) <= b ? -1 : 1;
      } else {
        return a < b ? -1 : 1;
      }
    };
    var FileSystemLoader = class {
      constructor(root, plugins) {
        this.root = root;
        this.sources = {};
        this.traces = {};
        this.importNr = 0;
        this.core = new Core(plugins);
        this.tokensByFile = {};
      }
      fetch(_newPath, relativeTo, _trace) {
        let newPath = _newPath.replace(/^["']|["']$/g, ""), trace = _trace || String.fromCharCode(this.importNr++);
        return new Promise((resolve, reject) => {
          let relativeDir = _path2.default.dirname(relativeTo), rootRelativePath = _path2.default.resolve(relativeDir, newPath), fileRelativePath = _path2.default.resolve(_path2.default.join(this.root, relativeDir), newPath);
          if (newPath[0] !== "." && newPath[0] !== "/") {
            try {
              fileRelativePath = __require.resolve(newPath);
            } catch (e) {
            }
          }
          const tokens = this.tokensByFile[fileRelativePath];
          if (tokens) {
            return resolve(tokens);
          }
          _fs2.default.readFile(fileRelativePath, "utf-8", (err, source) => {
            if (err)
              reject(err);
            this.core.load(source, rootRelativePath, trace, this.fetch.bind(this)).then(({ injectableSource, exportTokens }) => {
              this.sources[fileRelativePath] = injectableSource;
              this.traces[trace] = fileRelativePath;
              this.tokensByFile[fileRelativePath] = exportTokens;
              resolve(exportTokens);
            }, reject);
          });
        });
      }
      get finalSource() {
        const traces = this.traces;
        const sources = this.sources;
        let written = /* @__PURE__ */ new Set();
        return Object.keys(traces).sort(traceKeySorter).map((key) => {
          const filename = traces[key];
          if (written.has(filename)) {
            return null;
          }
          written.add(filename);
          return sources[filename];
        }).join("");
      }
    };
    exports.default = FileSystemLoader;
  }
});

// node_modules/string-hash/index.js
var require_string_hash = __commonJS({
  "node_modules/string-hash/index.js"(exports, module) {
    "use strict";
    function hash(str) {
      var hash2 = 5381, i = str.length;
      while (i) {
        hash2 = hash2 * 33 ^ str.charCodeAt(--i);
      }
      return hash2 >>> 0;
    }
    module.exports = hash;
  }
});

// node_modules/postcss-modules/build/generateScopedName.js
var require_generateScopedName = __commonJS({
  "node_modules/postcss-modules/build/generateScopedName.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = generateScopedName;
    var _stringHash = require_string_hash();
    var _stringHash2 = _interopRequireDefault(_stringHash);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function generateScopedName(name, filename, css) {
      const i = css.indexOf(`.${name}`);
      const lineNumber = css.substr(0, i).split(/[\r\n]/).length;
      const hash = (0, _stringHash2.default)(css).toString(36).substr(0, 5);
      return `_${name}_${hash}_${lineNumber}`;
    }
  }
});

// node_modules/postcss-modules/build/saveJSON.js
var require_saveJSON = __commonJS({
  "node_modules/postcss-modules/build/saveJSON.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = saveJSON;
    var _fs = require_fs();
    function saveJSON(cssFile, json) {
      return new Promise((resolve, reject) => {
        (0, _fs.writeFile)(`${cssFile}.json`, JSON.stringify(json), (e) => e ? reject(e) : resolve(json));
      });
    }
  }
});

// node_modules/icss-utils/src/replaceValueSymbols.js
var require_replaceValueSymbols = __commonJS({
  "node_modules/icss-utils/src/replaceValueSymbols.js"(exports, module) {
    var matchValueName = /[$]?[\w-]+/g;
    var replaceValueSymbols = (value, replacements) => {
      let matches;
      while (matches = matchValueName.exec(value)) {
        const replacement = replacements[matches[0]];
        if (replacement) {
          value = value.slice(0, matches.index) + replacement + value.slice(matchValueName.lastIndex);
          matchValueName.lastIndex -= matches[0].length - replacement.length;
        }
      }
      return value;
    };
    module.exports = replaceValueSymbols;
  }
});

// node_modules/icss-utils/src/replaceSymbols.js
var require_replaceSymbols = __commonJS({
  "node_modules/icss-utils/src/replaceSymbols.js"(exports, module) {
    var replaceValueSymbols = require_replaceValueSymbols();
    var replaceSymbols = (css, replacements) => {
      css.walk((node) => {
        if (node.type === "decl" && node.value) {
          node.value = replaceValueSymbols(node.value.toString(), replacements);
        } else if (node.type === "rule" && node.selector) {
          node.selector = replaceValueSymbols(
            node.selector.toString(),
            replacements
          );
        } else if (node.type === "atrule" && node.params) {
          node.params = replaceValueSymbols(node.params.toString(), replacements);
        }
      });
    };
    module.exports = replaceSymbols;
  }
});

// node_modules/icss-utils/src/extractICSS.js
var require_extractICSS = __commonJS({
  "node_modules/icss-utils/src/extractICSS.js"(exports, module) {
    var importPattern = /^:import\(("[^"]*"|'[^']*'|[^"']+)\)$/;
    var balancedQuotes = /^("[^"]*"|'[^']*'|[^"']+)$/;
    var getDeclsObject = (rule) => {
      const object = {};
      rule.walkDecls((decl) => {
        const before = decl.raws.before ? decl.raws.before.trim() : "";
        object[before + decl.prop] = decl.value;
      });
      return object;
    };
    var extractICSS = (css, removeRules = true, mode = "auto") => {
      const icssImports = {};
      const icssExports = {};
      function addImports(node, path) {
        const unquoted = path.replace(/'|"/g, "");
        icssImports[unquoted] = Object.assign(
          icssImports[unquoted] || {},
          getDeclsObject(node)
        );
        if (removeRules) {
          node.remove();
        }
      }
      function addExports(node) {
        Object.assign(icssExports, getDeclsObject(node));
        if (removeRules) {
          node.remove();
        }
      }
      css.each((node) => {
        if (node.type === "rule" && mode !== "at-rule") {
          if (node.selector.slice(0, 7) === ":import") {
            const matches = importPattern.exec(node.selector);
            if (matches) {
              addImports(node, matches[1]);
            }
          }
          if (node.selector === ":export") {
            addExports(node);
          }
        }
        if (node.type === "atrule" && mode !== "rule") {
          if (node.name === "icss-import") {
            const matches = balancedQuotes.exec(node.params);
            if (matches) {
              addImports(node, matches[1]);
            }
          }
          if (node.name === "icss-export") {
            addExports(node);
          }
        }
      });
      return { icssImports, icssExports };
    };
    module.exports = extractICSS;
  }
});

// node_modules/icss-utils/src/createICSSRules.js
var require_createICSSRules = __commonJS({
  "node_modules/icss-utils/src/createICSSRules.js"(exports, module) {
    var createImports = (imports, postcss, mode = "rule") => {
      return Object.keys(imports).map((path) => {
        const aliases = imports[path];
        const declarations = Object.keys(aliases).map(
          (key) => postcss.decl({
            prop: key,
            value: aliases[key],
            raws: { before: "\n  " }
          })
        );
        const hasDeclarations = declarations.length > 0;
        const rule = mode === "rule" ? postcss.rule({
          selector: `:import('${path}')`,
          raws: { after: hasDeclarations ? "\n" : "" }
        }) : postcss.atRule({
          name: "icss-import",
          params: `'${path}'`,
          raws: { after: hasDeclarations ? "\n" : "" }
        });
        if (hasDeclarations) {
          rule.append(declarations);
        }
        return rule;
      });
    };
    var createExports = (exports2, postcss, mode = "rule") => {
      const declarations = Object.keys(exports2).map(
        (key) => postcss.decl({
          prop: key,
          value: exports2[key],
          raws: { before: "\n  " }
        })
      );
      if (declarations.length === 0) {
        return [];
      }
      const rule = mode === "rule" ? postcss.rule({
        selector: `:export`,
        raws: { after: "\n" }
      }) : postcss.atRule({
        name: "icss-export",
        raws: { after: "\n" }
      });
      rule.append(declarations);
      return [rule];
    };
    var createICSSRules = (imports, exports2, postcss, mode) => [
      ...createImports(imports, postcss, mode),
      ...createExports(exports2, postcss, mode)
    ];
    module.exports = createICSSRules;
  }
});

// node_modules/icss-utils/src/index.js
var require_src4 = __commonJS({
  "node_modules/icss-utils/src/index.js"(exports, module) {
    var replaceValueSymbols = require_replaceValueSymbols();
    var replaceSymbols = require_replaceSymbols();
    var extractICSS = require_extractICSS();
    var createICSSRules = require_createICSSRules();
    module.exports = {
      replaceValueSymbols,
      replaceSymbols,
      extractICSS,
      createICSSRules
    };
  }
});

// node_modules/postcss-modules-local-by-default/src/index.js
var require_src5 = __commonJS({
  "node_modules/postcss-modules-local-by-default/src/index.js"(exports, module) {
    "use strict";
    var selectorParser = require_dist2();
    var valueParser = require_lib();
    var { extractICSS } = require_src4();
    var isSpacing = (node) => node.type === "combinator" && node.value === " ";
    function normalizeNodeArray(nodes) {
      const array = [];
      nodes.forEach((x) => {
        if (Array.isArray(x)) {
          normalizeNodeArray(x).forEach((item) => {
            array.push(item);
          });
        } else if (x) {
          array.push(x);
        }
      });
      if (array.length > 0 && isSpacing(array[array.length - 1])) {
        array.pop();
      }
      return array;
    }
    function localizeNode(rule, mode, localAliasMap) {
      const transform = (node, context) => {
        if (context.ignoreNextSpacing && !isSpacing(node)) {
          throw new Error("Missing whitespace after " + context.ignoreNextSpacing);
        }
        if (context.enforceNoSpacing && isSpacing(node)) {
          throw new Error("Missing whitespace before " + context.enforceNoSpacing);
        }
        let newNodes;
        switch (node.type) {
          case "root": {
            let resultingGlobal;
            context.hasPureGlobals = false;
            newNodes = node.nodes.map((n) => {
              const nContext = {
                global: context.global,
                lastWasSpacing: true,
                hasLocals: false,
                explicit: false
              };
              n = transform(n, nContext);
              if (typeof resultingGlobal === "undefined") {
                resultingGlobal = nContext.global;
              } else if (resultingGlobal !== nContext.global) {
                throw new Error(
                  'Inconsistent rule global/local result in rule "' + node + '" (multiple selectors must result in the same mode for the rule)'
                );
              }
              if (!nContext.hasLocals) {
                context.hasPureGlobals = true;
              }
              return n;
            });
            context.global = resultingGlobal;
            node.nodes = normalizeNodeArray(newNodes);
            break;
          }
          case "selector": {
            newNodes = node.map((childNode) => transform(childNode, context));
            node = node.clone();
            node.nodes = normalizeNodeArray(newNodes);
            break;
          }
          case "combinator": {
            if (isSpacing(node)) {
              if (context.ignoreNextSpacing) {
                context.ignoreNextSpacing = false;
                context.lastWasSpacing = false;
                context.enforceNoSpacing = false;
                return null;
              }
              context.lastWasSpacing = true;
              return node;
            }
            break;
          }
          case "pseudo": {
            let childContext;
            const isNested = !!node.length;
            const isScoped = node.value === ":local" || node.value === ":global";
            const isImportExport = node.value === ":import" || node.value === ":export";
            if (isImportExport) {
              context.hasLocals = true;
            } else if (isNested) {
              if (isScoped) {
                if (node.nodes.length === 0) {
                  throw new Error(`${node.value}() can't be empty`);
                }
                if (context.inside) {
                  throw new Error(
                    `A ${node.value} is not allowed inside of a ${context.inside}(...)`
                  );
                }
                childContext = {
                  global: node.value === ":global",
                  inside: node.value,
                  hasLocals: false,
                  explicit: true
                };
                newNodes = node.map((childNode) => transform(childNode, childContext)).reduce((acc, next) => acc.concat(next.nodes), []);
                if (newNodes.length) {
                  const { before, after } = node.spaces;
                  const first = newNodes[0];
                  const last = newNodes[newNodes.length - 1];
                  first.spaces = { before, after: first.spaces.after };
                  last.spaces = { before: last.spaces.before, after };
                }
                node = newNodes;
                break;
              } else {
                childContext = {
                  global: context.global,
                  inside: context.inside,
                  lastWasSpacing: true,
                  hasLocals: false,
                  explicit: context.explicit
                };
                newNodes = node.map(
                  (childNode) => transform(childNode, childContext)
                );
                node = node.clone();
                node.nodes = normalizeNodeArray(newNodes);
                if (childContext.hasLocals) {
                  context.hasLocals = true;
                }
              }
              break;
            } else if (isScoped) {
              if (context.inside) {
                throw new Error(
                  `A ${node.value} is not allowed inside of a ${context.inside}(...)`
                );
              }
              const addBackSpacing = !!node.spaces.before;
              context.ignoreNextSpacing = context.lastWasSpacing ? node.value : false;
              context.enforceNoSpacing = context.lastWasSpacing ? false : node.value;
              context.global = node.value === ":global";
              context.explicit = true;
              return addBackSpacing ? selectorParser.combinator({ value: " " }) : null;
            }
            break;
          }
          case "id":
          case "class": {
            if (!node.value) {
              throw new Error("Invalid class or id selector syntax");
            }
            if (context.global) {
              break;
            }
            const isImportedValue = localAliasMap.has(node.value);
            const isImportedWithExplicitScope = isImportedValue && context.explicit;
            if (!isImportedValue || isImportedWithExplicitScope) {
              const innerNode = node.clone();
              innerNode.spaces = { before: "", after: "" };
              node = selectorParser.pseudo({
                value: ":local",
                nodes: [innerNode],
                spaces: node.spaces
              });
              context.hasLocals = true;
            }
            break;
          }
        }
        context.lastWasSpacing = false;
        context.ignoreNextSpacing = false;
        context.enforceNoSpacing = false;
        return node;
      };
      const rootContext = {
        global: mode === "global",
        hasPureGlobals: false
      };
      rootContext.selector = selectorParser((root) => {
        transform(root, rootContext);
      }).processSync(rule, { updateSelector: false, lossless: true });
      return rootContext;
    }
    function localizeDeclNode(node, context) {
      switch (node.type) {
        case "word":
          if (context.localizeNextItem) {
            if (!context.localAliasMap.has(node.value)) {
              node.value = ":local(" + node.value + ")";
              context.localizeNextItem = false;
            }
          }
          break;
        case "function":
          if (context.options && context.options.rewriteUrl && node.value.toLowerCase() === "url") {
            node.nodes.map((nestedNode) => {
              if (nestedNode.type !== "string" && nestedNode.type !== "word") {
                return;
              }
              let newUrl = context.options.rewriteUrl(
                context.global,
                nestedNode.value
              );
              switch (nestedNode.type) {
                case "string":
                  if (nestedNode.quote === "'") {
                    newUrl = newUrl.replace(/(\\)/g, "\\$1").replace(/'/g, "\\'");
                  }
                  if (nestedNode.quote === '"') {
                    newUrl = newUrl.replace(/(\\)/g, "\\$1").replace(/"/g, '\\"');
                  }
                  break;
                case "word":
                  newUrl = newUrl.replace(/("|'|\)|\\)/g, "\\$1");
                  break;
              }
              nestedNode.value = newUrl;
            });
          }
          break;
      }
      return node;
    }
    function isWordAFunctionArgument(wordNode, functionNode) {
      return functionNode ? functionNode.nodes.some(
        (functionNodeChild) => functionNodeChild.sourceIndex === wordNode.sourceIndex
      ) : false;
    }
    function localizeDeclarationValues(localize, declaration, context) {
      const valueNodes = valueParser(declaration.value);
      valueNodes.walk((node, index, nodes) => {
        const subContext = {
          options: context.options,
          global: context.global,
          localizeNextItem: localize && !context.global,
          localAliasMap: context.localAliasMap
        };
        nodes[index] = localizeDeclNode(node, subContext);
      });
      declaration.value = valueNodes.toString();
    }
    function localizeDeclaration(declaration, context) {
      const isAnimation = /animation$/i.test(declaration.prop);
      if (isAnimation) {
        const validIdent = /^-?[_a-z][_a-z0-9-]*$/i;
        const animationKeywords = {
          $alternate: 1,
          "$alternate-reverse": 1,
          $backwards: 1,
          $both: 1,
          $ease: 1,
          "$ease-in": 1,
          "$ease-in-out": 1,
          "$ease-out": 1,
          $forwards: 1,
          $infinite: 1,
          $linear: 1,
          $none: Infinity,
          $normal: 1,
          $paused: 1,
          $reverse: 1,
          $running: 1,
          "$step-end": 1,
          "$step-start": 1,
          $initial: Infinity,
          $inherit: Infinity,
          $unset: Infinity
        };
        const didParseAnimationName = false;
        let parsedAnimationKeywords = {};
        let stepsFunctionNode = null;
        const valueNodes = valueParser(declaration.value).walk((node) => {
          if (node.type === "div") {
            parsedAnimationKeywords = {};
          }
          if (node.type === "function" && node.value.toLowerCase() === "steps") {
            stepsFunctionNode = node;
          }
          const value = node.type === "word" && !isWordAFunctionArgument(node, stepsFunctionNode) ? node.value.toLowerCase() : null;
          let shouldParseAnimationName = false;
          if (!didParseAnimationName && value && validIdent.test(value)) {
            if ("$" + value in animationKeywords) {
              parsedAnimationKeywords["$" + value] = "$" + value in parsedAnimationKeywords ? parsedAnimationKeywords["$" + value] + 1 : 0;
              shouldParseAnimationName = parsedAnimationKeywords["$" + value] >= animationKeywords["$" + value];
            } else {
              shouldParseAnimationName = true;
            }
          }
          const subContext = {
            options: context.options,
            global: context.global,
            localizeNextItem: shouldParseAnimationName && !context.global,
            localAliasMap: context.localAliasMap
          };
          return localizeDeclNode(node, subContext);
        });
        declaration.value = valueNodes.toString();
        return;
      }
      const isAnimationName = /animation(-name)?$/i.test(declaration.prop);
      if (isAnimationName) {
        return localizeDeclarationValues(true, declaration, context);
      }
      const hasUrl = /url\(/i.test(declaration.value);
      if (hasUrl) {
        return localizeDeclarationValues(false, declaration, context);
      }
    }
    module.exports = (options = {}) => {
      if (options && options.mode && options.mode !== "global" && options.mode !== "local" && options.mode !== "pure") {
        throw new Error(
          'options.mode must be either "global", "local" or "pure" (default "local")'
        );
      }
      const pureMode = options && options.mode === "pure";
      const globalMode = options && options.mode === "global";
      return {
        postcssPlugin: "postcss-modules-local-by-default",
        prepare() {
          const localAliasMap = /* @__PURE__ */ new Map();
          return {
            Once(root) {
              const { icssImports } = extractICSS(root, false);
              Object.keys(icssImports).forEach((key) => {
                Object.keys(icssImports[key]).forEach((prop) => {
                  localAliasMap.set(prop, icssImports[key][prop]);
                });
              });
              root.walkAtRules((atRule) => {
                if (/keyframes$/i.test(atRule.name)) {
                  const globalMatch = /^\s*:global\s*\((.+)\)\s*$/.exec(
                    atRule.params
                  );
                  const localMatch = /^\s*:local\s*\((.+)\)\s*$/.exec(
                    atRule.params
                  );
                  let globalKeyframes = globalMode;
                  if (globalMatch) {
                    if (pureMode) {
                      throw atRule.error(
                        "@keyframes :global(...) is not allowed in pure mode"
                      );
                    }
                    atRule.params = globalMatch[1];
                    globalKeyframes = true;
                  } else if (localMatch) {
                    atRule.params = localMatch[0];
                    globalKeyframes = false;
                  } else if (!globalMode) {
                    if (atRule.params && !localAliasMap.has(atRule.params)) {
                      atRule.params = ":local(" + atRule.params + ")";
                    }
                  }
                  atRule.walkDecls((declaration) => {
                    localizeDeclaration(declaration, {
                      localAliasMap,
                      options,
                      global: globalKeyframes
                    });
                  });
                } else if (atRule.nodes) {
                  atRule.nodes.forEach((declaration) => {
                    if (declaration.type === "decl") {
                      localizeDeclaration(declaration, {
                        localAliasMap,
                        options,
                        global: globalMode
                      });
                    }
                  });
                }
              });
              root.walkRules((rule) => {
                if (rule.parent && rule.parent.type === "atrule" && /keyframes$/i.test(rule.parent.name)) {
                  return;
                }
                const context = localizeNode(rule, options.mode, localAliasMap);
                context.options = options;
                context.localAliasMap = localAliasMap;
                if (pureMode && context.hasPureGlobals) {
                  throw rule.error(
                    'Selector "' + rule.selector + '" is not pure (pure selectors must contain at least one local class or id)'
                  );
                }
                rule.selector = context.selector;
                if (rule.nodes) {
                  rule.nodes.forEach(
                    (declaration) => localizeDeclaration(declaration, context)
                  );
                }
              });
            }
          };
        }
      };
    };
    module.exports.postcss = true;
  }
});

// node_modules/postcss-modules-extract-imports/src/topologicalSort.js
var require_topologicalSort = __commonJS({
  "node_modules/postcss-modules-extract-imports/src/topologicalSort.js"(exports, module) {
    var PERMANENT_MARKER = 2;
    var TEMPORARY_MARKER = 1;
    function createError(node, graph) {
      const er = new Error("Nondeterministic import's order");
      const related = graph[node];
      const relatedNode = related.find(
        (relatedNode2) => graph[relatedNode2].indexOf(node) > -1
      );
      er.nodes = [node, relatedNode];
      return er;
    }
    function walkGraph(node, graph, state, result, strict) {
      if (state[node] === PERMANENT_MARKER) {
        return;
      }
      if (state[node] === TEMPORARY_MARKER) {
        if (strict) {
          return createError(node, graph);
        }
        return;
      }
      state[node] = TEMPORARY_MARKER;
      const children = graph[node];
      const length = children.length;
      for (let i = 0; i < length; ++i) {
        const error = walkGraph(children[i], graph, state, result, strict);
        if (error instanceof Error) {
          return error;
        }
      }
      state[node] = PERMANENT_MARKER;
      result.push(node);
    }
    function topologicalSort(graph, strict) {
      const result = [];
      const state = {};
      const nodes = Object.keys(graph);
      const length = nodes.length;
      for (let i = 0; i < length; ++i) {
        const er = walkGraph(nodes[i], graph, state, result, strict);
        if (er instanceof Error) {
          return er;
        }
      }
      return result;
    }
    module.exports = topologicalSort;
  }
});

// node_modules/postcss-modules-extract-imports/src/index.js
var require_src6 = __commonJS({
  "node_modules/postcss-modules-extract-imports/src/index.js"(exports, module) {
    var topologicalSort = require_topologicalSort();
    var matchImports = /^(.+?)\s+from\s+(?:"([^"]+)"|'([^']+)'|(global))$/;
    var icssImport = /^:import\((?:"([^"]+)"|'([^']+)')\)/;
    var VISITED_MARKER = 1;
    function addImportToGraph(importId, parentId, graph, visited) {
      const siblingsId = parentId + "_siblings";
      const visitedId = parentId + "_" + importId;
      if (visited[visitedId] !== VISITED_MARKER) {
        if (!Array.isArray(visited[siblingsId])) {
          visited[siblingsId] = [];
        }
        const siblings = visited[siblingsId];
        if (Array.isArray(graph[importId])) {
          graph[importId] = graph[importId].concat(siblings);
        } else {
          graph[importId] = siblings.slice();
        }
        visited[visitedId] = VISITED_MARKER;
        siblings.push(importId);
      }
    }
    module.exports = (options = {}) => {
      let importIndex = 0;
      const createImportedName = typeof options.createImportedName !== "function" ? (importName) => `i__imported_${importName.replace(/\W/g, "_")}_${importIndex++}` : options.createImportedName;
      const failOnWrongOrder = options.failOnWrongOrder;
      return {
        postcssPlugin: "postcss-modules-extract-imports",
        prepare() {
          const graph = {};
          const visited = {};
          const existingImports = {};
          const importDecls = {};
          const imports = {};
          return {
            Once(root, postcss) {
              root.walkRules((rule) => {
                const matches = icssImport.exec(rule.selector);
                if (matches) {
                  const [, doubleQuotePath, singleQuotePath] = matches;
                  const importPath = doubleQuotePath || singleQuotePath;
                  addImportToGraph(importPath, "root", graph, visited);
                  existingImports[importPath] = rule;
                }
              });
              root.walkDecls(/^composes$/, (declaration) => {
                const matches = declaration.value.match(matchImports);
                if (!matches) {
                  return;
                }
                let tmpSymbols;
                let [
                  ,
                  symbols,
                  doubleQuotePath,
                  singleQuotePath,
                  global2
                ] = matches;
                if (global2) {
                  tmpSymbols = symbols.split(/\s+/).map((s) => `global(${s})`);
                } else {
                  const importPath = doubleQuotePath || singleQuotePath;
                  let parent = declaration.parent;
                  let parentIndexes = "";
                  while (parent.type !== "root") {
                    parentIndexes = parent.parent.index(parent) + "_" + parentIndexes;
                    parent = parent.parent;
                  }
                  const { selector } = declaration.parent;
                  const parentRule = `_${parentIndexes}${selector}`;
                  addImportToGraph(importPath, parentRule, graph, visited);
                  importDecls[importPath] = declaration;
                  imports[importPath] = imports[importPath] || {};
                  tmpSymbols = symbols.split(/\s+/).map((s) => {
                    if (!imports[importPath][s]) {
                      imports[importPath][s] = createImportedName(s, importPath);
                    }
                    return imports[importPath][s];
                  });
                }
                declaration.value = tmpSymbols.join(" ");
              });
              const importsOrder = topologicalSort(graph, failOnWrongOrder);
              if (importsOrder instanceof Error) {
                const importPath = importsOrder.nodes.find(
                  (importPath2) => importDecls.hasOwnProperty(importPath2)
                );
                const decl = importDecls[importPath];
                throw decl.error(
                  "Failed to resolve order of composed modules " + importsOrder.nodes.map((importPath2) => "`" + importPath2 + "`").join(", ") + ".",
                  {
                    plugin: "postcss-modules-extract-imports",
                    word: "composes"
                  }
                );
              }
              let lastImportRule;
              importsOrder.forEach((path) => {
                const importedSymbols = imports[path];
                let rule = existingImports[path];
                if (!rule && importedSymbols) {
                  rule = postcss.rule({
                    selector: `:import("${path}")`,
                    raws: { after: "\n" }
                  });
                  if (lastImportRule) {
                    root.insertAfter(lastImportRule, rule);
                  } else {
                    root.prepend(rule);
                  }
                }
                lastImportRule = rule;
                if (!importedSymbols) {
                  return;
                }
                Object.keys(importedSymbols).forEach((importedSymbol) => {
                  rule.append(
                    postcss.decl({
                      value: importedSymbol,
                      prop: importedSymbols[importedSymbol],
                      raws: { before: "\n  " }
                    })
                  );
                });
              });
            }
          };
        }
      };
    };
    module.exports.postcss = true;
  }
});

// node_modules/postcss-modules-scope/src/index.js
var require_src7 = __commonJS({
  "node_modules/postcss-modules-scope/src/index.js"(exports, module) {
    "use strict";
    var selectorParser = require_dist2();
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function getSingleLocalNamesForComposes(root) {
      return root.nodes.map((node) => {
        if (node.type !== "selector" || node.nodes.length !== 1) {
          throw new Error(
            `composition is only allowed when selector is single :local class name not in "${root}"`
          );
        }
        node = node.nodes[0];
        if (node.type !== "pseudo" || node.value !== ":local" || node.nodes.length !== 1) {
          throw new Error(
            'composition is only allowed when selector is single :local class name not in "' + root + '", "' + node + '" is weird'
          );
        }
        node = node.first;
        if (node.type !== "selector" || node.length !== 1) {
          throw new Error(
            'composition is only allowed when selector is single :local class name not in "' + root + '", "' + node + '" is weird'
          );
        }
        node = node.first;
        if (node.type !== "class") {
          throw new Error(
            'composition is only allowed when selector is single :local class name not in "' + root + '", "' + node + '" is weird'
          );
        }
        return node.value;
      });
    }
    var whitespace = "[\\x20\\t\\r\\n\\f]";
    var unescapeRegExp = new RegExp(
      "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)",
      "ig"
    );
    function unescape(str) {
      return str.replace(unescapeRegExp, (_, escaped, escapedWhitespace) => {
        const high = "0x" + escaped - 65536;
        return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
      });
    }
    var plugin = (options = {}) => {
      const generateScopedName = options && options.generateScopedName || plugin.generateScopedName;
      const generateExportEntry = options && options.generateExportEntry || plugin.generateExportEntry;
      const exportGlobals = options && options.exportGlobals;
      return {
        postcssPlugin: "postcss-modules-scope",
        Once(root, { rule }) {
          const exports2 = /* @__PURE__ */ Object.create(null);
          function exportScopedName(name, rawName) {
            const scopedName = generateScopedName(
              rawName ? rawName : name,
              root.source.input.from,
              root.source.input.css
            );
            const exportEntry = generateExportEntry(
              rawName ? rawName : name,
              scopedName,
              root.source.input.from,
              root.source.input.css
            );
            const { key, value } = exportEntry;
            exports2[key] = exports2[key] || [];
            if (exports2[key].indexOf(value) < 0) {
              exports2[key].push(value);
            }
            return scopedName;
          }
          function localizeNode(node) {
            switch (node.type) {
              case "selector":
                node.nodes = node.map(localizeNode);
                return node;
              case "class":
                return selectorParser.className({
                  value: exportScopedName(
                    node.value,
                    node.raws && node.raws.value ? node.raws.value : null
                  )
                });
              case "id": {
                return selectorParser.id({
                  value: exportScopedName(
                    node.value,
                    node.raws && node.raws.value ? node.raws.value : null
                  )
                });
              }
            }
            throw new Error(
              `${node.type} ("${node}") is not allowed in a :local block`
            );
          }
          function traverseNode(node) {
            switch (node.type) {
              case "pseudo":
                if (node.value === ":local") {
                  if (node.nodes.length !== 1) {
                    throw new Error('Unexpected comma (",") in :local block');
                  }
                  const selector = localizeNode(node.first, node.spaces);
                  selector.first.spaces = node.spaces;
                  const nextNode = node.next();
                  if (nextNode && nextNode.type === "combinator" && nextNode.value === " " && /\\[A-F0-9]{1,6}$/.test(selector.last.value)) {
                    selector.last.spaces.after = " ";
                  }
                  node.replaceWith(selector);
                  return;
                }
              case "root":
              case "selector": {
                node.each(traverseNode);
                break;
              }
              case "id":
              case "class":
                if (exportGlobals) {
                  exports2[node.value] = [node.value];
                }
                break;
            }
            return node;
          }
          const importedNames = {};
          root.walkRules(/^:import\(.+\)$/, (rule2) => {
            rule2.walkDecls((decl) => {
              importedNames[decl.prop] = true;
            });
          });
          root.walkRules((rule2) => {
            let parsedSelector = selectorParser().astSync(rule2);
            rule2.selector = traverseNode(parsedSelector.clone()).toString();
            rule2.walkDecls(/composes|compose-with/i, (decl) => {
              const localNames = getSingleLocalNamesForComposes(parsedSelector);
              const classes = decl.value.split(/\s+/);
              classes.forEach((className) => {
                const global2 = /^global\(([^)]+)\)$/.exec(className);
                if (global2) {
                  localNames.forEach((exportedName) => {
                    exports2[exportedName].push(global2[1]);
                  });
                } else if (hasOwnProperty.call(importedNames, className)) {
                  localNames.forEach((exportedName) => {
                    exports2[exportedName].push(className);
                  });
                } else if (hasOwnProperty.call(exports2, className)) {
                  localNames.forEach((exportedName) => {
                    exports2[className].forEach((item) => {
                      exports2[exportedName].push(item);
                    });
                  });
                } else {
                  throw decl.error(
                    `referenced class name "${className}" in ${decl.prop} not found`
                  );
                }
              });
              decl.remove();
            });
            rule2.walkDecls((decl) => {
              if (!/:local\s*\((.+?)\)/.test(decl.value)) {
                return;
              }
              let tokens = decl.value.split(/(,|'[^']*'|"[^"]*")/);
              tokens = tokens.map((token, idx) => {
                if (idx === 0 || tokens[idx - 1] === ",") {
                  let result = token;
                  const localMatch = /:local\s*\((.+?)\)/.exec(token);
                  if (localMatch) {
                    const input = localMatch.input;
                    const matchPattern = localMatch[0];
                    const matchVal = localMatch[1];
                    const newVal = exportScopedName(matchVal);
                    result = input.replace(matchPattern, newVal);
                  } else {
                    return token;
                  }
                  return result;
                } else {
                  return token;
                }
              });
              decl.value = tokens.join("");
            });
          });
          root.walkAtRules(/keyframes$/i, (atRule) => {
            const localMatch = /^\s*:local\s*\((.+?)\)\s*$/.exec(atRule.params);
            if (!localMatch) {
              return;
            }
            atRule.params = exportScopedName(localMatch[1]);
          });
          const exportedNames = Object.keys(exports2);
          if (exportedNames.length > 0) {
            const exportRule = rule({ selector: ":export" });
            exportedNames.forEach(
              (exportedName) => exportRule.append({
                prop: exportedName,
                value: exports2[exportedName].join(" "),
                raws: { before: "\n  " }
              })
            );
            root.append(exportRule);
          }
        }
      };
    };
    plugin.postcss = true;
    plugin.generateScopedName = function(name, path) {
      const sanitisedPath = path.replace(/\.[^./\\]+$/, "").replace(/[\W_]+/g, "_").replace(/^_|_$/g, "");
      return `_${sanitisedPath}__${name}`.trim();
    };
    plugin.generateExportEntry = function(name, scopedName) {
      return {
        key: unescape(name),
        value: unescape(scopedName)
      };
    };
    module.exports = plugin;
  }
});

// node_modules/postcss-modules-values/src/index.js
var require_src8 = __commonJS({
  "node_modules/postcss-modules-values/src/index.js"(exports, module) {
    "use strict";
    var ICSSUtils = require_src4();
    var matchImports = /^(.+?|\([\s\S]+?\))\s+from\s+("[^"]*"|'[^']*'|[\w-]+)$/;
    var matchValueDefinition = /(?:\s+|^)([\w-]+):?(.*?)$/;
    var matchImport = /^([\w-]+)(?:\s+as\s+([\w-]+))?/;
    module.exports = (options) => {
      let importIndex = 0;
      const createImportedName = options && options.createImportedName || ((importName) => `i__const_${importName.replace(/\W/g, "_")}_${importIndex++}`);
      return {
        postcssPlugin: "postcss-modules-values",
        prepare(result) {
          const importAliases = [];
          const definitions = {};
          return {
            Once(root, postcss) {
              root.walkAtRules(/value/i, (atRule) => {
                const matches = atRule.params.match(matchImports);
                if (matches) {
                  let [, aliases, path] = matches;
                  if (definitions[path]) {
                    path = definitions[path];
                  }
                  const imports = aliases.replace(/^\(\s*([\s\S]+)\s*\)$/, "$1").split(/\s*,\s*/).map((alias) => {
                    const tokens = matchImport.exec(alias);
                    if (tokens) {
                      const [, theirName, myName = theirName] = tokens;
                      const importedName = createImportedName(myName);
                      definitions[myName] = importedName;
                      return { theirName, importedName };
                    } else {
                      throw new Error(`@import statement "${alias}" is invalid!`);
                    }
                  });
                  importAliases.push({ path, imports });
                  atRule.remove();
                  return;
                }
                if (atRule.params.indexOf("@value") !== -1) {
                  result.warn("Invalid value definition: " + atRule.params);
                }
                let [, key, value] = `${atRule.params}${atRule.raws.between}`.match(
                  matchValueDefinition
                );
                const normalizedValue = value.replace(/\/\*((?!\*\/).*?)\*\//g, "");
                if (normalizedValue.length === 0) {
                  result.warn("Invalid value definition: " + atRule.params);
                  atRule.remove();
                  return;
                }
                let isOnlySpace = /^\s+$/.test(normalizedValue);
                if (!isOnlySpace) {
                  value = value.trim();
                }
                definitions[key] = ICSSUtils.replaceValueSymbols(
                  value,
                  definitions
                );
                atRule.remove();
              });
              if (!Object.keys(definitions).length) {
                return;
              }
              ICSSUtils.replaceSymbols(root, definitions);
              const exportDeclarations = Object.keys(definitions).map(
                (key) => postcss.decl({
                  value: definitions[key],
                  prop: key,
                  raws: { before: "\n  " }
                })
              );
              if (exportDeclarations.length > 0) {
                const exportRule = postcss.rule({
                  selector: ":export",
                  raws: { after: "\n" }
                });
                exportRule.append(exportDeclarations);
                root.prepend(exportRule);
              }
              importAliases.reverse().forEach(({ path, imports }) => {
                const importRule = postcss.rule({
                  selector: `:import(${path})`,
                  raws: { after: "\n" }
                });
                imports.forEach(({ theirName, importedName }) => {
                  importRule.append({
                    value: theirName,
                    prop: importedName,
                    raws: { before: "\n  " }
                  });
                });
                root.prepend(importRule);
              });
            }
          };
        }
      };
    };
    module.exports.postcss = true;
  }
});

// node_modules/postcss-modules/build/behaviours.js
var require_behaviours = __commonJS({
  "node_modules/postcss-modules/build/behaviours.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.behaviours = void 0;
    exports.getDefaultPlugins = getDefaultPlugins;
    exports.isValidBehaviour = isValidBehaviour;
    var _postcssModulesLocalByDefault = require_src5();
    var _postcssModulesLocalByDefault2 = _interopRequireDefault(_postcssModulesLocalByDefault);
    var _postcssModulesExtractImports = require_src6();
    var _postcssModulesExtractImports2 = _interopRequireDefault(_postcssModulesExtractImports);
    var _postcssModulesScope = require_src7();
    var _postcssModulesScope2 = _interopRequireDefault(_postcssModulesScope);
    var _postcssModulesValues = require_src8();
    var _postcssModulesValues2 = _interopRequireDefault(_postcssModulesValues);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    var behaviours = exports.behaviours = {
      LOCAL: "local",
      GLOBAL: "global"
    };
    function getDefaultPlugins({
      behaviour,
      generateScopedName,
      exportGlobals
    }) {
      const scope = (0, _postcssModulesScope2.default)({ generateScopedName, exportGlobals });
      const plugins = {
        [behaviours.LOCAL]: [_postcssModulesValues2.default, (0, _postcssModulesLocalByDefault2.default)({ mode: "local" }), _postcssModulesExtractImports2.default, scope],
        [behaviours.GLOBAL]: [_postcssModulesValues2.default, (0, _postcssModulesLocalByDefault2.default)({ mode: "global" }), _postcssModulesExtractImports2.default, scope]
      };
      return plugins[behaviour];
    }
    function isValidBehaviour(behaviour) {
      return Object.keys(behaviours).map((key) => behaviours[key]).indexOf(behaviour) > -1;
    }
  }
});

// node_modules/postcss-modules/build/index.js
var require_build = __commonJS({
  "node_modules/postcss-modules/build/index.js"(exports, module) {
    "use strict";
    var _postcss = require_postcss();
    var _postcss2 = _interopRequireDefault(_postcss);
    var _lodash = require_lodash();
    var _lodash2 = _interopRequireDefault(_lodash);
    var _genericNames = require_generic_names();
    var _genericNames2 = _interopRequireDefault(_genericNames);
    var _unquote = require_unquote();
    var _unquote2 = _interopRequireDefault(_unquote);
    var _parser = require_parser();
    var _parser2 = _interopRequireDefault(_parser);
    var _loader = require_loader();
    var _loader2 = _interopRequireDefault(_loader);
    var _generateScopedName = require_generateScopedName();
    var _generateScopedName2 = _interopRequireDefault(_generateScopedName);
    var _saveJSON = require_saveJSON();
    var _saveJSON2 = _interopRequireDefault(_saveJSON);
    var _behaviours = require_behaviours();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
    function _asyncToGenerator(fn) {
      return function() {
        var gen = fn.apply(this, arguments);
        return new Promise(function(resolve, reject) {
          function step(key, arg) {
            try {
              var info = gen[key](arg);
              var value = info.value;
            } catch (error) {
              reject(error);
              return;
            }
            if (info.done) {
              resolve(value);
            } else {
              return Promise.resolve(value).then(function(value2) {
                step("next", value2);
              }, function(err) {
                step("throw", err);
              });
            }
          }
          return step("next");
        });
      };
    }
    var PLUGIN_NAME = "postcss-modules";
    function getDefaultScopeBehaviour(opts) {
      if (opts.scopeBehaviour && (0, _behaviours.isValidBehaviour)(opts.scopeBehaviour)) {
        return opts.scopeBehaviour;
      }
      return _behaviours.behaviours.LOCAL;
    }
    function getScopedNameGenerator(opts) {
      const scopedNameGenerator = opts.generateScopedName || _generateScopedName2.default;
      if (typeof scopedNameGenerator === "function")
        return scopedNameGenerator;
      return (0, _genericNames2.default)(scopedNameGenerator, {
        context: process.cwd(),
        hashPrefix: opts.hashPrefix
      });
    }
    function getLoader(opts, plugins) {
      const root = typeof opts.root === "undefined" ? "/" : opts.root;
      return typeof opts.Loader === "function" ? new opts.Loader(root, plugins) : new _loader2.default(root, plugins);
    }
    function isGlobalModule(globalModules, inputFile) {
      return globalModules.some((regex) => inputFile.match(regex));
    }
    function getDefaultPluginsList(opts, inputFile) {
      const globalModulesList = opts.globalModulePaths || null;
      const exportGlobals = opts.exportGlobals || false;
      const defaultBehaviour = getDefaultScopeBehaviour(opts);
      const generateScopedName = getScopedNameGenerator(opts);
      if (globalModulesList && isGlobalModule(globalModulesList, inputFile)) {
        return (0, _behaviours.getDefaultPlugins)({
          behaviour: _behaviours.behaviours.GLOBAL,
          generateScopedName,
          exportGlobals
        });
      }
      return (0, _behaviours.getDefaultPlugins)({
        behaviour: defaultBehaviour,
        generateScopedName,
        exportGlobals
      });
    }
    function isOurPlugin(plugin) {
      return plugin.postcssPlugin === PLUGIN_NAME;
    }
    function dashesCamelCase(string) {
      return string.replace(/-+(\w)/g, (_, firstLetter) => firstLetter.toUpperCase());
    }
    module.exports = (opts = {}) => {
      return {
        postcssPlugin: PLUGIN_NAME,
        OnceExit(css, { result }) {
          return _asyncToGenerator(function* () {
            const getJSON = opts.getJSON || _saveJSON2.default;
            const inputFile = css.source.input.file;
            const pluginList = getDefaultPluginsList(opts, inputFile);
            const resultPluginIndex = result.processor.plugins.findIndex(function(plugin) {
              return isOurPlugin(plugin);
            });
            if (resultPluginIndex === -1) {
              throw new Error("Plugin missing from options.");
            }
            const earlierPlugins = result.processor.plugins.slice(0, resultPluginIndex);
            const loaderPlugins = [...earlierPlugins, ...pluginList];
            const loader = getLoader(opts, loaderPlugins);
            const fetcher = function fetcher2(file, relativeTo, depTrace) {
              const unquoteFile = (0, _unquote2.default)(file);
              const resolvedResult = typeof opts.resolve === "function" && opts.resolve(unquoteFile);
              const resolvedFile = resolvedResult instanceof Promise ? resolvedResult : Promise.resolve(resolvedResult);
              return resolvedFile.then(function(f) {
                return loader.fetch.call(loader, `"${f || unquoteFile}"`, relativeTo, depTrace);
              });
            };
            const parser = new _parser2.default(fetcher);
            yield (0, _postcss2.default)([...pluginList, parser.plugin()]).process(css, {
              from: inputFile
            });
            const out = loader.finalSource;
            if (out)
              css.prepend(out);
            if (opts.localsConvention) {
              const isFunc = typeof opts.localsConvention === "function";
              parser.exportTokens = Object.entries(parser.exportTokens).reduce(function(tokens, [className, value]) {
                if (isFunc) {
                  tokens[opts.localsConvention(className, value, inputFile)] = value;
                  return tokens;
                }
                switch (opts.localsConvention) {
                  case "camelCase":
                    tokens[className] = value;
                    tokens[(0, _lodash2.default)(className)] = value;
                    break;
                  case "camelCaseOnly":
                    tokens[(0, _lodash2.default)(className)] = value;
                    break;
                  case "dashes":
                    tokens[className] = value;
                    tokens[dashesCamelCase(className)] = value;
                    break;
                  case "dashesOnly":
                    tokens[dashesCamelCase(className)] = value;
                    break;
                }
                return tokens;
              }, {});
            }
            result.messages.push({
              type: "export",
              plugin: "postcss-modules",
              exportTokens: parser.exportTokens
            });
            return getJSON(css.source.input.file, parser.exportTokens, result.opts.to);
          })();
        }
      };
    };
    module.exports.postcss = true;
  }
});

// node_modules/rollup-plugin-postcss/dist/index.js
var require_dist4 = __commonJS({
  "node_modules/rollup-plugin-postcss/dist/index.js"(exports, module) {
    "use strict";
    var path = require_path();
    var rollupPluginutils = (init_pluginutils_es(), __toCommonJS(pluginutils_es_exports));
    var Concat = require_concat_with_sourcemaps();
    var series = require_promise();
    var importCwd = require_import_cwd();
    var postcss = require_postcss();
    var findPostcssConfig = require_src2();
    var safeIdentifier = (init_safe_identifier(), __toCommonJS(safe_identifier_exports));
    var pify = require_pify();
    var resolve = require_resolve();
    var PQueue = require_dist3();
    function _interopDefaultLegacy(e) {
      return e && typeof e === "object" && "default" in e ? e : { "default": e };
    }
    var path__default = _interopDefaultLegacy(path);
    var Concat__default = _interopDefaultLegacy(Concat);
    var series__default = _interopDefaultLegacy(series);
    var importCwd__default = _interopDefaultLegacy(importCwd);
    var postcss__default = _interopDefaultLegacy(postcss);
    var findPostcssConfig__default = _interopDefaultLegacy(findPostcssConfig);
    var pify__default = _interopDefaultLegacy(pify);
    var resolve__default = _interopDefaultLegacy(resolve);
    var PQueue__default = _interopDefaultLegacy(PQueue);
    function asyncGeneratorStep(gen, resolve2, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }
      if (info.done) {
        resolve2(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }
    function _asyncToGenerator(fn) {
      return function() {
        var self2 = this, args = arguments;
        return new Promise(function(resolve2, reject) {
          var gen = fn.apply(self2, args);
          function _next(value) {
            asyncGeneratorStep(gen, resolve2, reject, _next, _throw, "next", value);
          }
          function _throw(err) {
            asyncGeneratorStep(gen, resolve2, reject, _next, _throw, "throw", err);
          }
          _next(void 0);
        });
      };
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
          symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it;
      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it)
            o = it;
          var i = 0;
          var F = function() {
          };
          return {
            s: F,
            n: function() {
              if (i >= o.length)
                return {
                  done: true
                };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function(e) {
              throw e;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var normalCompletion = true, didErr = false, err;
      return {
        s: function() {
          it = o[Symbol.iterator]();
        },
        n: function() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function(e) {
          didErr = true;
          err = e;
        },
        f: function() {
          try {
            if (!normalCompletion && it.return != null)
              it.return();
          } finally {
            if (didErr)
              throw err;
          }
        }
      };
    }
    var normalizePath = (path2) => path2 && path2.replace(/\\+/g, "/");
    var humanlizePath = (filepath) => normalizePath(path__default["default"].relative(process.cwd(), filepath));
    var styleInjectPath = __require.resolve("style-inject/dist/style-inject.es").replace(/[\\/]+/g, "/");
    function loadConfig(id, {
      ctx: configOptions,
      path: configPath
    }) {
      const handleError = (err) => {
        if (!err.message.includes("No PostCSS Config found")) {
          throw err;
        }
        return {};
      };
      configPath = configPath ? path__default["default"].resolve(configPath) : path__default["default"].dirname(id);
      const ctx = {
        file: {
          extname: path__default["default"].extname(id),
          dirname: path__default["default"].dirname(id),
          basename: path__default["default"].basename(id)
        },
        options: configOptions || {}
      };
      return findPostcssConfig__default["default"](ctx, configPath).catch(handleError);
    }
    function escapeClassNameDashes(string) {
      return string.replace(/-+/g, (match) => {
        return `$${match.replace(/-/g, "_")}$`;
      });
    }
    function ensureClassName(name) {
      name = escapeClassNameDashes(name);
      return safeIdentifier.identifier(name, false);
    }
    function ensurePostCSSOption(option) {
      return typeof option === "string" ? importCwd__default["default"](option) : option;
    }
    function isModuleFile(file) {
      return /\.module\.[a-z]{2,6}$/.test(file);
    }
    var postcssLoader = {
      name: "postcss",
      alwaysProcess: true,
      process({
        code,
        map
      }) {
        var _this = this;
        return _asyncToGenerator(function* () {
          const config = _this.options.config ? yield loadConfig(_this.id, _this.options.config) : {};
          const options = _this.options;
          const plugins = [...options.postcss.plugins || [], ...config.plugins || []];
          const shouldExtract = options.extract;
          const shouldInject = options.inject;
          const modulesExported = {};
          const autoModules = options.autoModules !== false && options.onlyModules !== true;
          const isAutoModule = autoModules && isModuleFile(_this.id);
          const supportModules = autoModules ? isAutoModule : options.modules;
          if (supportModules) {
            plugins.unshift(require_build()(_objectSpread2(_objectSpread2({
              generateScopedName: process.env.ROLLUP_POSTCSS_TEST ? "[name]_[local]" : "[name]_[local]__[hash:base64:5]"
            }, options.modules), {}, {
              getJSON(filepath, json, outpath) {
                modulesExported[filepath] = json;
                if (typeof options.modules === "object" && typeof options.modules.getJSON === "function") {
                  return options.modules.getJSON(filepath, json, outpath);
                }
              }
            })));
          }
          if (!shouldExtract && options.minimize) {
            plugins.push(require_src()(options.minimize));
          }
          const postcssOptions = _objectSpread2(_objectSpread2(_objectSpread2({}, _this.options.postcss), config.options), {}, {
            to: options.to || _this.id,
            from: _this.id,
            map: _this.sourceMap ? shouldExtract ? {
              inline: false,
              annotation: false
            } : {
              inline: true,
              annotation: false
            } : false
          });
          delete postcssOptions.plugins;
          postcssOptions.parser = ensurePostCSSOption(postcssOptions.parser);
          postcssOptions.syntax = ensurePostCSSOption(postcssOptions.syntax);
          postcssOptions.stringifier = ensurePostCSSOption(postcssOptions.stringifier);
          if (map && postcssOptions.map) {
            postcssOptions.map.prev = typeof map === "string" ? JSON.parse(map) : map;
          }
          if (plugins.length === 0) {
            const noopPlugin = () => {
              return {
                postcssPlugin: "postcss-noop-plugin",
                Once() {
                }
              };
            };
            plugins.push(noopPlugin());
          }
          const result = yield postcss__default["default"](plugins).process(code, postcssOptions);
          var _iterator = _createForOfIteratorHelper(result.messages), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              const message = _step.value;
              if (message.type === "dependency") {
                _this.dependencies.add(message.file);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          var _iterator2 = _createForOfIteratorHelper(result.warnings()), _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
              const warning = _step2.value;
              if (!warning.message) {
                warning.message = warning.text;
              }
              _this.warn(warning);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          const outputMap = result.map && JSON.parse(result.map.toString());
          if (outputMap && outputMap.sources) {
            outputMap.sources = outputMap.sources.map((v) => normalizePath(v));
          }
          let output = "";
          let extracted;
          if (options.namedExports) {
            const json = modulesExported[_this.id];
            const getClassName = typeof options.namedExports === "function" ? options.namedExports : ensureClassName;
            for (const name in json) {
              const newName = getClassName(name);
              if (name !== newName && typeof options.namedExports !== "function") {
                _this.warn(`Exported "${name}" as "${newName}" in ${humanlizePath(_this.id)}`);
              }
              if (!json[newName]) {
                json[newName] = json[name];
              }
              output += `export var ${newName} = ${JSON.stringify(json[name])};
`;
            }
          }
          const cssVariableName = safeIdentifier.identifier("css", true);
          if (shouldExtract) {
            output += `export default ${JSON.stringify(modulesExported[_this.id])};`;
            extracted = {
              id: _this.id,
              code: result.css,
              map: outputMap
            };
          } else {
            const module2 = supportModules ? JSON.stringify(modulesExported[_this.id]) : cssVariableName;
            output += `var ${cssVariableName} = ${JSON.stringify(result.css)};
export default ${module2};
export var stylesheet=${JSON.stringify(result.css)};`;
          }
          if (!shouldExtract && shouldInject) {
            output += typeof options.inject === "function" ? options.inject(cssVariableName, _this.id) : `
import styleInject from '${styleInjectPath}';
styleInject(${cssVariableName}${Object.keys(options.inject).length > 0 ? `,${JSON.stringify(options.inject)}` : ""});`;
          }
          return {
            code: output,
            map: outputMap,
            extracted
          };
        })();
      }
    };
    function loadModule(moduleId) {
      try {
        return __require(moduleId);
      } catch (_unused) {
      }
      return importCwd__default["default"].silent(moduleId);
    }
    var threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
    var workQueue = new PQueue__default["default"]({
      concurrency: threadPoolSize - 1
    });
    var moduleRe = /^~([a-z\d]|@).+/i;
    var getUrlOfPartial = (url) => {
      const parsedUrl = path__default["default"].parse(url);
      return `${parsedUrl.dir}${path__default["default"].sep}_${parsedUrl.base}`;
    };
    var resolvePromise = pify__default["default"](resolve__default["default"]);
    var sassModuleIds = ["sass", "node-sass"];
    var sassLoader = {
      name: "sass",
      test: /\.(sass|scss)$/,
      process({
        code
      }) {
        return new Promise((resolve2, reject) => {
          const sass = loadSassOrThrow();
          const render = pify__default["default"](sass.render.bind(sass));
          const data = this.options.data || "";
          workQueue.add(() => render(_objectSpread2(_objectSpread2({}, this.options), {}, {
            file: this.id,
            data: data + code,
            indentedSyntax: /\.sass$/.test(this.id),
            sourceMap: this.sourceMap,
            importer: [(url, importer, done) => {
              if (!moduleRe.test(url))
                return done({
                  file: url
                });
              const moduleUrl = url.slice(1);
              const partialUrl = getUrlOfPartial(moduleUrl);
              const options = {
                basedir: path__default["default"].dirname(importer),
                extensions: [".scss", ".sass", ".css"]
              };
              const finishImport = (id) => {
                done({
                  file: id.endsWith(".css") ? id.replace(/\.css$/, "") : id
                });
              };
              const next = () => {
                done({
                  file: url
                });
              };
              resolvePromise(partialUrl, options).then(finishImport).catch((error) => {
                if (error.code === "MODULE_NOT_FOUND" || error.code === "ENOENT") {
                  resolvePromise(moduleUrl, options).then(finishImport).catch(next);
                } else {
                  next();
                }
              });
            }].concat(this.options.importer || [])
          })).then((result) => {
            var _iterator = _createForOfIteratorHelper(result.stats.includedFiles), _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                const file = _step.value;
                this.dependencies.add(file);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            resolve2({
              code: result.css.toString(),
              map: result.map && result.map.toString()
            });
          }).catch(reject));
        });
      }
    };
    function loadSassOrThrow() {
      var _iterator2 = _createForOfIteratorHelper(sassModuleIds), _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          const moduleId = _step2.value;
          const module2 = loadModule(moduleId);
          if (module2) {
            return module2;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      throw new Error("You need to install one of the following packages: " + sassModuleIds.map((moduleId) => `"${moduleId}"`).join(", ") + " in order to process SASS files");
    }
    var stylusLoader = {
      name: "stylus",
      test: /\.(styl|stylus)$/,
      process({
        code
      }) {
        var _this = this;
        return _asyncToGenerator(function* () {
          const stylus = loadModule("stylus");
          if (!stylus) {
            throw new Error('You need to install "stylus" packages in order to process Stylus files');
          }
          const style = stylus(code, _objectSpread2(_objectSpread2({}, _this.options), {}, {
            filename: _this.id,
            sourcemap: _this.sourceMap && {}
          }));
          const css = yield pify__default["default"](style.render.bind(style))();
          const deps = style.deps();
          var _iterator = _createForOfIteratorHelper(deps), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              const dep = _step.value;
              _this.dependencies.add(dep);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return {
            code: css,
            map: style.sourcemap
          };
        })();
      }
    };
    var lessLoader = {
      name: "less",
      test: /\.less$/,
      process({
        code
      }) {
        var _this = this;
        return _asyncToGenerator(function* () {
          const less = loadModule("less");
          if (!less) {
            throw new Error('You need to install "less" packages in order to process Less files');
          }
          let _yield$pify = yield pify__default["default"](less.render.bind(less))(code, _objectSpread2(_objectSpread2({}, _this.options), {}, {
            sourceMap: _this.sourceMap && {},
            filename: _this.id
          })), css = _yield$pify.css, map = _yield$pify.map, imports = _yield$pify.imports;
          var _iterator = _createForOfIteratorHelper(imports), _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done; ) {
              const dep = _step.value;
              _this.dependencies.add(dep);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          if (map) {
            map = JSON.parse(map);
            map.sources = map.sources.map((source) => humanlizePath(source));
          }
          return {
            code: css,
            map
          };
        })();
      }
    };
    var matchFile = (filepath, condition) => {
      if (typeof condition === "function") {
        return condition(filepath);
      }
      return condition && condition.test(filepath);
    };
    var Loaders = class {
      constructor(options = {}) {
        this.use = options.use.map((rule) => {
          if (typeof rule === "string") {
            return [rule];
          }
          if (Array.isArray(rule)) {
            return rule;
          }
          throw new TypeError("The rule in `use` option must be string or Array!");
        });
        this.loaders = [];
        const extensions = options.extensions || [".css", ".sss", ".pcss"];
        const customPostcssLoader = _objectSpread2(_objectSpread2({}, postcssLoader), {}, {
          test: (filepath) => extensions.some((ext) => path__default["default"].extname(filepath) === ext)
        });
        this.registerLoader(customPostcssLoader);
        this.registerLoader(sassLoader);
        this.registerLoader(stylusLoader);
        this.registerLoader(lessLoader);
        if (options.loaders) {
          options.loaders.forEach((loader) => this.registerLoader(loader));
        }
      }
      registerLoader(loader) {
        const existing = this.getLoader(loader.name);
        if (existing) {
          this.removeLoader(loader.name);
        }
        this.loaders.push(loader);
        return this;
      }
      removeLoader(name) {
        this.loaders = this.loaders.filter((loader) => loader.name !== name);
        return this;
      }
      isSupported(filepath) {
        return this.loaders.some((loader) => {
          return matchFile(filepath, loader.test);
        });
      }
      process({
        code,
        map
      }, context) {
        return series__default["default"](this.use.slice().reverse().map(([name, options]) => {
          const loader = this.getLoader(name);
          const loaderContext = _objectSpread2({
            options: options || {}
          }, context);
          return (v) => {
            if (loader.alwaysProcess || matchFile(loaderContext.id, loader.test)) {
              return loader.process.call(loaderContext, v);
            }
            return v;
          };
        }), {
          code,
          map
        });
      }
      getLoader(name) {
        return this.loaders.find((loader) => loader.name === name);
      }
    };
    function inferOption(option, defaultValue) {
      if (option === false)
        return false;
      if (option && typeof option === "object")
        return option;
      return option ? {} : defaultValue;
    }
    function getRecursiveImportOrder(id, getModuleInfo, seen = /* @__PURE__ */ new Set()) {
      if (seen.has(id)) {
        return [];
      }
      seen.add(id);
      const result = [id];
      getModuleInfo(id).importedIds.forEach((importFile) => {
        result.push(...getRecursiveImportOrder(importFile, getModuleInfo, seen));
      });
      return result;
    }
    var index = (options = {}) => {
      const filter = rollupPluginutils.createFilter(options.include, options.exclude);
      const postcssPlugins = Array.isArray(options.plugins) ? options.plugins.filter(Boolean) : options.plugins;
      const sourceMap = options.sourceMap;
      const postcssLoaderOptions = {
        inject: typeof options.inject === "function" ? options.inject : inferOption(options.inject, {}),
        extract: typeof options.extract === "undefined" ? false : options.extract,
        onlyModules: options.modules === true,
        modules: inferOption(options.modules, false),
        namedExports: options.namedExports,
        autoModules: options.autoModules,
        minimize: inferOption(options.minimize, false),
        config: inferOption(options.config, {}),
        to: options.to,
        postcss: {
          parser: options.parser,
          plugins: postcssPlugins,
          syntax: options.syntax,
          stringifier: options.stringifier,
          exec: options.exec
        }
      };
      let use = ["sass", "stylus", "less"];
      if (Array.isArray(options.use)) {
        use = options.use;
      } else if (options.use !== null && typeof options.use === "object") {
        use = [["sass", options.use.sass || {}], ["stylus", options.use.stylus || {}], ["less", options.use.less || {}]];
      }
      use.unshift(["postcss", postcssLoaderOptions]);
      const loaders = new Loaders({
        use,
        loaders: options.loaders,
        extensions: options.extensions
      });
      const extracted = /* @__PURE__ */ new Map();
      return {
        name: "postcss",
        transform(code, id) {
          var _this = this;
          return _asyncToGenerator(function* () {
            if (!filter(id) || !loaders.isSupported(id)) {
              return null;
            }
            if (typeof options.onImport === "function") {
              options.onImport(id);
            }
            const loaderContext = {
              id,
              sourceMap,
              dependencies: /* @__PURE__ */ new Set(),
              warn: _this.warn.bind(_this),
              plugin: _this
            };
            const result = yield loaders.process({
              code,
              map: void 0
            }, loaderContext);
            var _iterator = _createForOfIteratorHelper(loaderContext.dependencies), _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                const dep = _step.value;
                _this.addWatchFile(dep);
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            if (postcssLoaderOptions.extract) {
              extracted.set(id, result.extracted);
              return {
                code: result.code,
                map: {
                  mappings: ""
                }
              };
            }
            return {
              code: result.code,
              map: result.map || {
                mappings: ""
              }
            };
          })();
        },
        augmentChunkHash() {
          if (extracted.size === 0)
            return;
          const extractedValue = [...extracted].reduce((object, [key, value]) => _objectSpread2(_objectSpread2({}, object), {}, {
            [key]: value
          }), {});
          return JSON.stringify(extractedValue);
        },
        generateBundle(options_, bundle) {
          var _this2 = this;
          return _asyncToGenerator(function* () {
            if (extracted.size === 0 || !(options_.dir || options_.file))
              return;
            const dir = options_.dir || path__default["default"].dirname(options_.file);
            const file = options_.file || path__default["default"].join(options_.dir, Object.keys(bundle).find((fileName) => bundle[fileName].isEntry));
            const getExtracted = () => {
              let fileName = `${path__default["default"].basename(file, path__default["default"].extname(file))}.css`;
              if (typeof postcssLoaderOptions.extract === "string") {
                fileName = path__default["default"].isAbsolute(postcssLoaderOptions.extract) ? normalizePath(path__default["default"].relative(dir, postcssLoaderOptions.extract)) : normalizePath(postcssLoaderOptions.extract);
              }
              const concat = new Concat__default["default"](true, fileName, "\n");
              const entries = [...extracted.values()];
              const _bundle$normalizePath = bundle[normalizePath(path__default["default"].relative(dir, file))], modules = _bundle$normalizePath.modules, facadeModuleId = _bundle$normalizePath.facadeModuleId;
              if (modules) {
                const moduleIds = getRecursiveImportOrder(facadeModuleId, _this2.getModuleInfo);
                entries.sort((a, b) => moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id));
              }
              for (var _i = 0, _entries = entries; _i < _entries.length; _i++) {
                const result = _entries[_i];
                const relative = normalizePath(path__default["default"].relative(dir, result.id));
                const map2 = result.map || null;
                if (map2) {
                  map2.file = fileName;
                }
                concat.add(relative, result.code, map2);
              }
              let code2 = concat.content;
              if (sourceMap === "inline") {
                code2 += `
/*# sourceMappingURL=data:application/json;base64,${Buffer.from(concat.sourceMap, "utf8").toString("base64")}*/`;
              } else if (sourceMap === true) {
                code2 += `
/*# sourceMappingURL=${path__default["default"].basename(fileName)}.map */`;
              }
              return {
                code: code2,
                map: sourceMap === true && concat.sourceMap,
                codeFileName: fileName,
                mapFileName: fileName + ".map"
              };
            };
            if (options.onExtract) {
              const shouldExtract = yield options.onExtract(getExtracted);
              if (shouldExtract === false) {
                return;
              }
            }
            let _getExtracted = getExtracted(), code = _getExtracted.code, codeFileName = _getExtracted.codeFileName, map = _getExtracted.map, mapFileName = _getExtracted.mapFileName;
            if (postcssLoaderOptions.minimize) {
              const cssOptions = {};
              cssOptions.from = codeFileName;
              if (sourceMap === "inline") {
                cssOptions.map = {
                  inline: true
                };
              } else if (sourceMap === true && map) {
                cssOptions.map = {
                  prev: map
                };
                cssOptions.to = codeFileName;
              }
              const result = yield require_src()(postcssLoaderOptions.minimize).process(code, cssOptions);
              code = result.css;
              if (sourceMap === true && result.map && result.map.toString) {
                map = result.map.toString();
              }
            }
            _this2.emitFile({
              fileName: codeFileName,
              type: "asset",
              source: code
            });
            if (map) {
              _this2.emitFile({
                fileName: mapFileName,
                type: "asset",
                source: map
              });
            }
          })();
        }
      };
    };
    module.exports = index;
  }
});

// dep:@typhonjs-fvtt_runtime___rollup-plugin-postcss
var typhonjs_fvtt_runtime_rollup_plugin_postcss_default = require_dist4();
export {
  typhonjs_fvtt_runtime_rollup_plugin_postcss_default as default
};
/**
 * Autoload Config for PostCSS
 *
 * @author Michael Ciniawsky @michael-ciniawsky <michael.ciniawsky@gmail.com>
 * @license MIT
 *
 * @module postcss-load-config
 * @version 2.1.0
 *
 * @requires comsiconfig
 * @requires ./options
 * @requires ./plugins
 */
//# sourceMappingURL=@typhonjs-fvtt_runtime___rollup-plugin-postcss.js.map
