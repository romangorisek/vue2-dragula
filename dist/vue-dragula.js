/*!
 * vue-dragula v3.0.0
 * (c) 2016 Yichang Liu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.vueDragula = global.vueDragula || {})));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var atoa = createCommonjsModule(function (module) {
	  module.exports = function atoa(a, n) {
	    return Array.prototype.slice.call(a, n);
	  };
	});

	var atoa$1 = interopDefault(atoa);

var require$$1 = Object.freeze({
	  default: atoa$1
	});

	var ticky = createCommonjsModule(function (module) {
	  var si = typeof setImmediate === 'function',
	      tick;
	  if (si) {
	    tick = function tick(fn) {
	      setImmediate(fn);
	    };
	  } else if (typeof process !== 'undefined' && process.nextTick) {
	    tick = process.nextTick;
	  } else {
	    tick = function tick(fn) {
	      setTimeout(fn, 0);
	    };
	  }

	  module.exports = tick;
	});

	var ticky$1 = interopDefault(ticky);

var require$$0$1 = Object.freeze({
	  default: ticky$1
	});

	var debounce = createCommonjsModule(function (module) {
	  'use strict';

	  var ticky = interopDefault(require$$0$1);

	  module.exports = function debounce(fn, args, ctx) {
	    if (!fn) {
	      return;
	    }
	    ticky(function run() {
	      fn.apply(ctx || null, args || []);
	    });
	  };
	});

	var debounce$1 = interopDefault(debounce);

var require$$0 = Object.freeze({
	  default: debounce$1
	});

	var emitter = createCommonjsModule(function (module) {
	  'use strict';

	  var atoa = interopDefault(require$$1);
	  var debounce = interopDefault(require$$0);

	  module.exports = function emitter(thing, options) {
	    var opts = options || {};
	    var evt = {};
	    if (thing === undefined) {
	      thing = {};
	    }
	    thing.on = function (type, fn) {
	      if (!evt[type]) {
	        evt[type] = [fn];
	      } else {
	        evt[type].push(fn);
	      }
	      return thing;
	    };
	    thing.once = function (type, fn) {
	      fn._once = true; // thing.off(fn) still works!
	      thing.on(type, fn);
	      return thing;
	    };
	    thing.off = function (type, fn) {
	      var c = arguments.length;
	      if (c === 1) {
	        delete evt[type];
	      } else if (c === 0) {
	        evt = {};
	      } else {
	        var et = evt[type];
	        if (!et) {
	          return thing;
	        }
	        et.splice(et.indexOf(fn), 1);
	      }
	      return thing;
	    };
	    thing.emit = function () {
	      var args = atoa(arguments);
	      return thing.emitterSnapshot(args.shift()).apply(this, args);
	    };
	    thing.emitterSnapshot = function (type) {
	      var et = (evt[type] || []).slice(0);
	      return function () {
	        var args = atoa(arguments);
	        var ctx = this || thing;
	        if (type === 'error' && opts.throws !== false && !et.length) {
	          throw args.length === 1 ? args[0] : args;
	        }
	        et.forEach(function emitter(listen) {
	          if (opts.async) {
	            debounce(listen, args, ctx);
	          } else {
	            listen.apply(ctx, args);
	          }
	          if (listen._once) {
	            thing.off(type, listen);
	          }
	        });
	        return thing;
	      };
	    };
	    return thing;
	  };
	});

	var emitter$1 = interopDefault(emitter);

var require$$2 = Object.freeze({
	  default: emitter$1
	});

	var index = createCommonjsModule(function (module) {
	  var NativeCustomEvent = commonjsGlobal.CustomEvent;

	  function useNative() {
	    try {
	      var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
	      return 'cat' === p.type && 'bar' === p.detail.foo;
	    } catch (e) {}
	    return false;
	  }

	  /**
	   * Cross-browser `CustomEvent` constructor.
	   *
	   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
	   *
	   * @public
	   */

	  module.exports = useNative() ? NativeCustomEvent :

	  // IE >= 9
	  'function' === typeof document.createEvent ? function CustomEvent(type, params) {
	    var e = document.createEvent('CustomEvent');
	    if (params) {
	      e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
	    } else {
	      e.initCustomEvent(type, false, false, void 0);
	    }
	    return e;
	  } :

	  // IE <= 8
	  function CustomEvent(type, params) {
	    var e = document.createEventObject();
	    e.type = type;
	    if (params) {
	      e.bubbles = Boolean(params.bubbles);
	      e.cancelable = Boolean(params.cancelable);
	      e.detail = params.detail;
	    } else {
	      e.bubbles = false;
	      e.cancelable = false;
	      e.detail = void 0;
	    }
	    return e;
	  };
	});

	var index$1 = interopDefault(index);

var require$$1$2 = Object.freeze({
	  default: index$1
	});

	var eventmap = createCommonjsModule(function (module) {
	  'use strict';

	  var eventmap = [];
	  var eventname = '';
	  var ron = /^on/;

	  for (eventname in commonjsGlobal) {
	    if (ron.test(eventname)) {
	      eventmap.push(eventname.slice(2));
	    }
	  }

	  module.exports = eventmap;
	});

	var eventmap$1 = interopDefault(eventmap);

var require$$0$2 = Object.freeze({
	  default: eventmap$1
	});

	var crossvent = createCommonjsModule(function (module) {
	  'use strict';

	  var customEvent = interopDefault(require$$1$2);
	  var eventmap = interopDefault(require$$0$2);
	  var doc = commonjsGlobal.document;
	  var addEvent = addEventEasy;
	  var removeEvent = removeEventEasy;
	  var hardCache = [];

	  if (!commonjsGlobal.addEventListener) {
	    addEvent = addEventHard;
	    removeEvent = removeEventHard;
	  }

	  module.exports = {
	    add: addEvent,
	    remove: removeEvent,
	    fabricate: fabricateEvent
	  };

	  function addEventEasy(el, type, fn, capturing) {
	    return el.addEventListener(type, fn, capturing);
	  }

	  function addEventHard(el, type, fn) {
	    return el.attachEvent('on' + type, wrap(el, type, fn));
	  }

	  function removeEventEasy(el, type, fn, capturing) {
	    return el.removeEventListener(type, fn, capturing);
	  }

	  function removeEventHard(el, type, fn) {
	    var listener = unwrap(el, type, fn);
	    if (listener) {
	      return el.detachEvent('on' + type, listener);
	    }
	  }

	  function fabricateEvent(el, type, model) {
	    var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
	    if (el.dispatchEvent) {
	      el.dispatchEvent(e);
	    } else {
	      el.fireEvent('on' + type, e);
	    }
	    function makeClassicEvent() {
	      var e;
	      if (doc.createEvent) {
	        e = doc.createEvent('Event');
	        e.initEvent(type, true, true);
	      } else if (doc.createEventObject) {
	        e = doc.createEventObject();
	      }
	      return e;
	    }
	    function makeCustomEvent() {
	      return new customEvent(type, { detail: model });
	    }
	  }

	  function wrapperFactory(el, type, fn) {
	    return function wrapper(originalEvent) {
	      var e = originalEvent || commonjsGlobal.event;
	      e.target = e.target || e.srcElement;
	      e.preventDefault = e.preventDefault || function preventDefault() {
	        e.returnValue = false;
	      };
	      e.stopPropagation = e.stopPropagation || function stopPropagation() {
	        e.cancelBubble = true;
	      };
	      e.which = e.which || e.keyCode;
	      fn.call(el, e);
	    };
	  }

	  function wrap(el, type, fn) {
	    var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
	    hardCache.push({
	      wrapper: wrapper,
	      element: el,
	      type: type,
	      fn: fn
	    });
	    return wrapper;
	  }

	  function unwrap(el, type, fn) {
	    var i = find(el, type, fn);
	    if (i) {
	      var wrapper = hardCache[i].wrapper;
	      hardCache.splice(i, 1); // free up a tad of memory
	      return wrapper;
	    }
	  }

	  function find(el, type, fn) {
	    var i, item;
	    for (i = 0; i < hardCache.length; i++) {
	      item = hardCache[i];
	      if (item.element === el && item.type === type && item.fn === fn) {
	        return i;
	      }
	    }
	  }
	});

	var crossvent$1 = interopDefault(crossvent);
	var add = crossvent.add;
	var remove = crossvent.remove;
	var fabricate = crossvent.fabricate;

var require$$1$1 = Object.freeze({
	  default: crossvent$1,
	  add: add,
	  remove: remove,
	  fabricate: fabricate
	});

	var classes = createCommonjsModule(function (module) {
	  'use strict';

	  var cache = {};
	  var start = '(?:^|\\s)';
	  var end = '(?:\\s|$)';

	  function lookupClass(className) {
	    var cached = cache[className];
	    if (cached) {
	      cached.lastIndex = 0;
	    } else {
	      cache[className] = cached = new RegExp(start + className + end, 'g');
	    }
	    return cached;
	  }

	  function addClass(el, className) {
	    var current = el.className;
	    if (!current.length) {
	      el.className = className;
	    } else if (!lookupClass(className).test(current)) {
	      el.className += ' ' + className;
	    }
	  }

	  function rmClass(el, className) {
	    el.className = el.className.replace(lookupClass(className), ' ').trim();
	  }

	  module.exports = {
	    add: addClass,
	    rm: rmClass
	  };
	});

	var classes$1 = interopDefault(classes);
	var add$1 = classes.add;
	var rm = classes.rm;

var require$$0$3 = Object.freeze({
	  default: classes$1,
	  add: add$1,
	  rm: rm
	});

	var dragula = createCommonjsModule(function (module) {
	  'use strict';

	  var emitter = interopDefault(require$$2);
	  var crossvent = interopDefault(require$$1$1);
	  var classes = interopDefault(require$$0$3);
	  var doc = document;
	  var documentElement = doc.documentElement;

	  function dragula(initialContainers, options) {
	    var len = arguments.length;
	    if (len === 1 && Array.isArray(initialContainers) === false) {
	      options = initialContainers;
	      initialContainers = [];
	    }
	    var _mirror; // mirror image
	    var _source; // source container
	    var _item; // item being dragged
	    var _offsetX; // reference x
	    var _offsetY; // reference y
	    var _moveX; // reference move x
	    var _moveY; // reference move y
	    var _initialSibling; // reference sibling when grabbed
	    var _currentSibling; // reference sibling now
	    var _copy; // item used for copying
	    var _renderTimer; // timer for setTimeout renderMirrorImage
	    var _lastDropTarget = null; // last container item was over
	    var _grabbed; // holds mousedown context until first mousemove

	    var o = options || {};
	    if (o.moves === void 0) {
	      o.moves = always;
	    }
	    if (o.accepts === void 0) {
	      o.accepts = always;
	    }
	    if (o.invalid === void 0) {
	      o.invalid = invalidTarget;
	    }
	    if (o.containers === void 0) {
	      o.containers = initialContainers || [];
	    }
	    if (o.isContainer === void 0) {
	      o.isContainer = never;
	    }
	    if (o.copy === void 0) {
	      o.copy = false;
	    }
	    if (o.copySortSource === void 0) {
	      o.copySortSource = false;
	    }
	    if (o.revertOnSpill === void 0) {
	      o.revertOnSpill = false;
	    }
	    if (o.removeOnSpill === void 0) {
	      o.removeOnSpill = false;
	    }
	    if (o.direction === void 0) {
	      o.direction = 'vertical';
	    }
	    if (o.ignoreInputTextSelection === void 0) {
	      o.ignoreInputTextSelection = true;
	    }
	    if (o.mirrorContainer === void 0) {
	      o.mirrorContainer = doc.body;
	    }

	    var drake = emitter({
	      containers: o.containers,
	      start: manualStart,
	      end: end,
	      cancel: cancel,
	      remove: remove,
	      destroy: destroy,
	      canMove: canMove,
	      dragging: false
	    });

	    if (o.removeOnSpill === true) {
	      drake.on('over', spillOver).on('out', spillOut);
	    }

	    events();

	    return drake;

	    function isContainer(el) {
	      return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
	    }

	    function events(remove) {
	      var op = remove ? 'remove' : 'add';
	      touchy(documentElement, op, 'mousedown', grab);
	      touchy(documentElement, op, 'mouseup', release);
	    }

	    function eventualMovements(remove) {
	      var op = remove ? 'remove' : 'add';
	      touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
	    }

	    function movements(remove) {
	      var op = remove ? 'remove' : 'add';
	      crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
	      crossvent[op](documentElement, 'click', preventGrabbed);
	    }

	    function destroy() {
	      events(true);
	      release({});
	    }

	    function preventGrabbed(e) {
	      if (_grabbed) {
	        e.preventDefault();
	      }
	    }

	    function grab(e) {
	      _moveX = e.clientX;
	      _moveY = e.clientY;

	      var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
	      if (ignore) {
	        return; // we only care about honest-to-god left clicks and touch events
	      }
	      var item = e.target;
	      var context = canStart(item);
	      if (!context) {
	        return;
	      }
	      _grabbed = context;
	      eventualMovements();
	      if (e.type === 'mousedown') {
	        if (isInput(item)) {
	          // see also: https://github.com/bevacqua/dragula/issues/208
	          item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
	        } else {
	          e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
	        }
	      }
	    }

	    function startBecauseMouseMoved(e) {
	      if (!_grabbed) {
	        return;
	      }
	      if (whichMouseButton(e) === 0) {
	        release({});
	        return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
	      }
	      // truthy check fixes #239, equality fixes #207
	      if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
	        return;
	      }
	      if (o.ignoreInputTextSelection) {
	        var clientX = getCoord('clientX', e);
	        var clientY = getCoord('clientY', e);
	        var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
	        if (isInput(elementBehindCursor)) {
	          return;
	        }
	      }

	      var grabbed = _grabbed; // call to end() unsets _grabbed
	      eventualMovements(true);
	      movements();
	      end();
	      start(grabbed);

	      var offset = getOffset(_item);
	      _offsetX = getCoord('pageX', e) - offset.left;
	      _offsetY = getCoord('pageY', e) - offset.top;

	      classes.add(_copy || _item, 'gu-transit');
	      renderMirrorImage();
	      drag(e);
	    }

	    function canStart(item) {
	      if (drake.dragging && _mirror) {
	        return;
	      }
	      if (isContainer(item)) {
	        return; // don't drag container itself
	      }
	      var handle = item;
	      while (getParent(item) && isContainer(getParent(item)) === false) {
	        if (o.invalid(item, handle)) {
	          return;
	        }
	        item = getParent(item); // drag target should be a top element
	        if (!item) {
	          return;
	        }
	      }
	      var source = getParent(item);
	      if (!source) {
	        return;
	      }
	      if (o.invalid(item, handle)) {
	        return;
	      }

	      var movable = o.moves(item, source, handle, nextEl(item));
	      if (!movable) {
	        return;
	      }

	      return {
	        item: item,
	        source: source
	      };
	    }

	    function canMove(item) {
	      return !!canStart(item);
	    }

	    function manualStart(item) {
	      var context = canStart(item);
	      if (context) {
	        start(context);
	      }
	    }

	    function start(context) {
	      if (isCopy(context.item, context.source)) {
	        _copy = context.item.cloneNode(true);
	        drake.emit('cloned', _copy, context.item, 'copy');
	      }

	      _source = context.source;
	      _item = context.item;
	      _initialSibling = _currentSibling = nextEl(context.item);

	      drake.dragging = true;
	      drake.emit('drag', _item, _source);
	    }

	    function invalidTarget() {
	      return false;
	    }

	    function end() {
	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      drop(item, getParent(item));
	    }

	    function ungrab() {
	      _grabbed = false;
	      eventualMovements(true);
	      movements(true);
	    }

	    function release(e) {
	      ungrab();

	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	      if (dropTarget && (_copy && o.copySortSource || !_copy || dropTarget !== _source)) {
	        drop(item, dropTarget);
	      } else if (o.removeOnSpill) {
	        remove();
	      } else {
	        cancel();
	      }
	    }

	    function drop(item, target) {
	      var parent = getParent(item);
	      if (_copy && o.copySortSource && target === _source) {
	        parent.removeChild(_item);
	      }
	      if (isInitialPlacement(target)) {
	        drake.emit('cancel', item, _source, _source);
	      } else {
	        drake.emit('drop', item, target, _source, _currentSibling);
	      }
	      cleanup();
	    }

	    function remove() {
	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      var parent = getParent(item);
	      if (parent) {
	        parent.removeChild(item);
	      }
	      drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
	      cleanup();
	    }

	    function cancel(revert) {
	      if (!drake.dragging) {
	        return;
	      }
	      var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
	      var item = _copy || _item;
	      var parent = getParent(item);
	      var initial = isInitialPlacement(parent);
	      if (initial === false && reverts) {
	        if (_copy) {
	          if (parent) {
	            parent.removeChild(_copy);
	          }
	        } else {
	          _source.insertBefore(item, _initialSibling);
	        }
	      }
	      if (initial || reverts) {
	        drake.emit('cancel', item, _source, _source);
	      } else {
	        drake.emit('drop', item, parent, _source, _currentSibling);
	      }
	      cleanup();
	    }

	    function cleanup() {
	      var item = _copy || _item;
	      ungrab();
	      removeMirrorImage();
	      if (item) {
	        classes.rm(item, 'gu-transit');
	      }
	      if (_renderTimer) {
	        clearTimeout(_renderTimer);
	      }
	      drake.dragging = false;
	      if (_lastDropTarget) {
	        drake.emit('out', item, _lastDropTarget, _source);
	      }
	      drake.emit('dragend', item);
	      _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
	    }

	    function isInitialPlacement(target, s) {
	      var sibling;
	      if (s !== void 0) {
	        sibling = s;
	      } else if (_mirror) {
	        sibling = _currentSibling;
	      } else {
	        sibling = nextEl(_copy || _item);
	      }
	      return target === _source && sibling === _initialSibling;
	    }

	    function findDropTarget(elementBehindCursor, clientX, clientY) {
	      var target = elementBehindCursor;
	      while (target && !accepted()) {
	        target = getParent(target);
	      }
	      return target;

	      function accepted() {
	        var droppable = isContainer(target);
	        if (droppable === false) {
	          return false;
	        }

	        var immediate = getImmediateChild(target, elementBehindCursor);
	        var reference = getReference(target, immediate, clientX, clientY);
	        var initial = isInitialPlacement(target, reference);
	        if (initial) {
	          return true; // should always be able to drop it right back where it was
	        }
	        return o.accepts(_item, target, _source, reference);
	      }
	    }

	    function drag(e) {
	      if (!_mirror) {
	        return;
	      }
	      e.preventDefault();

	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var x = clientX - _offsetX;
	      var y = clientY - _offsetY;

	      _mirror.style.left = x + 'px';
	      _mirror.style.top = y + 'px';

	      var item = _copy || _item;
	      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	      var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
	      if (changed || dropTarget === null) {
	        out();
	        _lastDropTarget = dropTarget;
	        over();
	      }
	      var parent = getParent(item);
	      if (dropTarget === _source && _copy && !o.copySortSource) {
	        if (parent) {
	          parent.removeChild(item);
	        }
	        return;
	      }
	      var reference;
	      var immediate = getImmediateChild(dropTarget, elementBehindCursor);
	      if (immediate !== null) {
	        reference = getReference(dropTarget, immediate, clientX, clientY);
	      } else if (o.revertOnSpill === true && !_copy) {
	        reference = _initialSibling;
	        dropTarget = _source;
	      } else {
	        if (_copy && parent) {
	          parent.removeChild(item);
	        }
	        return;
	      }
	      if (reference === null && changed || reference !== item && reference !== nextEl(item)) {
	        _currentSibling = reference;
	        dropTarget.insertBefore(item, reference);
	        drake.emit('shadow', item, dropTarget, _source);
	      }
	      function moved(type) {
	        drake.emit(type, item, _lastDropTarget, _source);
	      }
	      function over() {
	        if (changed) {
	          moved('over');
	        }
	      }
	      function out() {
	        if (_lastDropTarget) {
	          moved('out');
	        }
	      }
	    }

	    function spillOver(el) {
	      classes.rm(el, 'gu-hide');
	    }

	    function spillOut(el) {
	      if (drake.dragging) {
	        classes.add(el, 'gu-hide');
	      }
	    }

	    function renderMirrorImage() {
	      if (_mirror) {
	        return;
	      }
	      var rect = _item.getBoundingClientRect();
	      _mirror = _item.cloneNode(true);
	      _mirror.style.width = getRectWidth(rect) + 'px';
	      _mirror.style.height = getRectHeight(rect) + 'px';
	      classes.rm(_mirror, 'gu-transit');
	      classes.add(_mirror, 'gu-mirror');
	      o.mirrorContainer.appendChild(_mirror);
	      touchy(documentElement, 'add', 'mousemove', drag);
	      classes.add(o.mirrorContainer, 'gu-unselectable');
	      drake.emit('cloned', _mirror, _item, 'mirror');
	    }

	    function removeMirrorImage() {
	      if (_mirror) {
	        classes.rm(o.mirrorContainer, 'gu-unselectable');
	        touchy(documentElement, 'remove', 'mousemove', drag);
	        getParent(_mirror).removeChild(_mirror);
	        _mirror = null;
	      }
	    }

	    function getImmediateChild(dropTarget, target) {
	      var immediate = target;
	      while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
	        immediate = getParent(immediate);
	      }
	      if (immediate === documentElement) {
	        return null;
	      }
	      return immediate;
	    }

	    function getReference(dropTarget, target, x, y) {
	      var horizontal = o.direction === 'horizontal';
	      var reference = target !== dropTarget ? inside() : outside();
	      return reference;

	      function outside() {
	        // slower, but able to figure out any position
	        var len = dropTarget.children.length;
	        var i;
	        var el;
	        var rect;
	        for (i = 0; i < len; i++) {
	          el = dropTarget.children[i];
	          rect = el.getBoundingClientRect();
	          if (horizontal && rect.left + rect.width / 2 > x) {
	            return el;
	          }
	          if (!horizontal && rect.top + rect.height / 2 > y) {
	            return el;
	          }
	        }
	        return null;
	      }

	      function inside() {
	        // faster, but only available if dropped inside a child element
	        var rect = target.getBoundingClientRect();
	        if (horizontal) {
	          return resolve(x > rect.left + getRectWidth(rect) / 2);
	        }
	        return resolve(y > rect.top + getRectHeight(rect) / 2);
	      }

	      function resolve(after) {
	        return after ? nextEl(target) : target;
	      }
	    }

	    function isCopy(item, container) {
	      return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
	    }
	  }

	  function touchy(el, op, type, fn) {
	    var touch = {
	      mouseup: 'touchend',
	      mousedown: 'touchstart',
	      mousemove: 'touchmove'
	    };
	    var pointers = {
	      mouseup: 'pointerup',
	      mousedown: 'pointerdown',
	      mousemove: 'pointermove'
	    };
	    var microsoft = {
	      mouseup: 'MSPointerUp',
	      mousedown: 'MSPointerDown',
	      mousemove: 'MSPointerMove'
	    };
	    if (commonjsGlobal.navigator.pointerEnabled) {
	      crossvent[op](el, pointers[type], fn);
	    } else if (commonjsGlobal.navigator.msPointerEnabled) {
	      crossvent[op](el, microsoft[type], fn);
	    } else {
	      crossvent[op](el, touch[type], fn);
	      crossvent[op](el, type, fn);
	    }
	  }

	  function whichMouseButton(e) {
	    if (e.touches !== void 0) {
	      return e.touches.length;
	    }
	    if (e.which !== void 0 && e.which !== 0) {
	      return e.which;
	    } // see https://github.com/bevacqua/dragula/issues/261
	    if (e.buttons !== void 0) {
	      return e.buttons;
	    }
	    var button = e.button;
	    if (button !== void 0) {
	      // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
	      return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	    }
	  }

	  function getOffset(el) {
	    var rect = el.getBoundingClientRect();
	    return {
	      left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
	      top: rect.top + getScroll('scrollTop', 'pageYOffset')
	    };
	  }

	  function getScroll(scrollProp, offsetProp) {
	    if (typeof commonjsGlobal[offsetProp] !== 'undefined') {
	      return commonjsGlobal[offsetProp];
	    }
	    if (documentElement.clientHeight) {
	      return documentElement[scrollProp];
	    }
	    return doc.body[scrollProp];
	  }

	  function getElementBehindPoint(point, x, y) {
	    var p = point || {};
	    var state = p.className;
	    var el;
	    p.className += ' gu-hide';
	    el = doc.elementFromPoint(x, y);
	    p.className = state;
	    return el;
	  }

	  function never() {
	    return false;
	  }
	  function always() {
	    return true;
	  }
	  function getRectWidth(rect) {
	    return rect.width || rect.right - rect.left;
	  }
	  function getRectHeight(rect) {
	    return rect.height || rect.bottom - rect.top;
	  }
	  function getParent(el) {
	    return el.parentNode === doc ? null : el.parentNode;
	  }
	  function isInput(el) {
	    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el);
	  }
	  function isEditable(el) {
	    if (!el) {
	      return false;
	    } // no parents were editable
	    if (el.contentEditable === 'false') {
	      return false;
	    } // stop the lookup
	    if (el.contentEditable === 'true') {
	      return true;
	    } // found a contentEditable element in the chain
	    return isEditable(getParent(el)); // contentEditable is set to 'inherit'
	  }

	  function nextEl(el) {
	    return el.nextElementSibling || manually();
	    function manually() {
	      var sibling = el;
	      do {
	        sibling = sibling.nextSibling;
	      } while (sibling && sibling.nodeType !== 1);
	      return sibling;
	    }
	  }

	  function getEventHost(e) {
	    // on touchend event, we have to use `e.changedTouches`
	    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
	    // see https://github.com/bevacqua/dragula/issues/34
	    if (e.targetTouches && e.targetTouches.length) {
	      return e.targetTouches[0];
	    }
	    if (e.changedTouches && e.changedTouches.length) {
	      return e.changedTouches[0];
	    }
	    return e;
	  }

	  function getCoord(coord, e) {
	    var host = getEventHost(e);
	    var missMap = {
	      pageX: 'clientX', // IE8
	      pageY: 'clientY' // IE8
	    };
	    if (coord in missMap && !(coord in host) && missMap[coord] in host) {
	      coord = missMap[coord];
	    }
	    return host[coord];
	  }

	  module.exports = dragula;
	});

	var dragula$1 = interopDefault(dragula);

	var asyncGenerator = function () {
	  function AwaitValue(value) {
	    this.value = value;
	  }

	  function AsyncGenerator(gen) {
	    var front, back;

	    function send(key, arg) {
	      return new Promise(function (resolve, reject) {
	        var request = {
	          key: key,
	          arg: arg,
	          resolve: resolve,
	          reject: reject,
	          next: null
	        };

	        if (back) {
	          back = back.next = request;
	        } else {
	          front = back = request;
	          resume(key, arg);
	        }
	      });
	    }

	    function resume(key, arg) {
	      try {
	        var result = gen[key](arg);
	        var value = result.value;

	        if (value instanceof AwaitValue) {
	          Promise.resolve(value.value).then(function (arg) {
	            resume("next", arg);
	          }, function (arg) {
	            resume("throw", arg);
	          });
	        } else {
	          settle(result.done ? "return" : "normal", result.value);
	        }
	      } catch (err) {
	        settle("throw", err);
	      }
	    }

	    function settle(type, value) {
	      switch (type) {
	        case "return":
	          front.resolve({
	            value: value,
	            done: true
	          });
	          break;

	        case "throw":
	          front.reject(value);
	          break;

	        default:
	          front.resolve({
	            value: value,
	            done: false
	          });
	          break;
	      }

	      front = front.next;

	      if (front) {
	        resume(front.key, front.arg);
	      } else {
	        back = null;
	      }
	    }

	    this._invoke = send;

	    if (typeof gen.return !== "function") {
	      this.return = undefined;
	    }
	  }

	  if (typeof Symbol === "function" && Symbol.asyncIterator) {
	    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
	      return this;
	    };
	  }

	  AsyncGenerator.prototype.next = function (arg) {
	    return this._invoke("next", arg);
	  };

	  AsyncGenerator.prototype.throw = function (arg) {
	    return this._invoke("throw", arg);
	  };

	  AsyncGenerator.prototype.return = function (arg) {
	    return this._invoke("return", arg);
	  };

	  return {
	    wrap: function (fn) {
	      return function () {
	        return new AsyncGenerator(fn.apply(this, arguments));
	      };
	    },
	    await: function (value) {
	      return new AwaitValue(value);
	    }
	  };
	}();

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var get = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = Object.getOwnPropertyDescriptor(object, property);

	  if (desc === undefined) {
	    var parent = Object.getPrototypeOf(object);

	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;

	    if (getter === undefined) {
	      return undefined;
	    }

	    return getter.call(receiver);
	  }
	};

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var BaseHandler = function () {
	  function BaseHandler(_ref) {
	    var dh = _ref.dh,
	        ctx = _ref.ctx,
	        _ref$options = _ref.options,
	        options = _ref$options === undefined ? {} : _ref$options;
	    classCallCheck(this, BaseHandler);

	    this.dh = dh;
	    this.logging = ctx.logging;
	    this.ctx = ctx;
	    this.logger = options.logger || console;
	    this.options = options;

	    this.delegateCtx(ctx);

	    this.configDelegates({
	      props: ['drake', 'dragIndex', 'dropIndex', 'sourceModel', 'targetModel', 'eventBus'],
	      methods: ['getModel']
	    });
	  }

	  createClass(BaseHandler, [{
	    key: 'delegateCtx',
	    value: function delegateCtx(ctx) {
	      this.eventBus = ctx.eventBus;
	      this.serviceName = ctx.name;
	      this.modelManager = ctx.modelManager;
	      this.findModelForContainer = ctx.findModelForContainer.bind(ctx);
	    }
	  }, {
	    key: 'configDelegates',
	    value: function configDelegates(_ref2) {
	      var _ref2$props = _ref2.props,
	          props = _ref2$props === undefined ? [] : _ref2$props,
	          _ref2$methods = _ref2.methods,
	          methods = _ref2$methods === undefined ? [] : _ref2$methods;

	      if (!this.dh) return;

	      // delegate properties
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var name = _step.value;

	          this[name] = this.dh[name];
	        }

	        // delegate methods (incl getters/setters)
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = methods[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var _name = _step2.value;

	          this[_name] = this.dh[_name].bind(this.dh);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'log',
	    value: function log(event) {
	      var _logger;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_logger = this.logger).log.apply(_logger, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'createCtx',
	    value: function createCtx(_ref3) {
	      var el = _ref3.el,
	          source = _ref3.source,
	          target = _ref3.target,
	          models = _ref3.models;

	      return {
	        element: el,
	        containers: {
	          source: source,
	          target: target
	        },
	        indexes: this.indexes,
	        models: models
	      };
	    }
	  }, {
	    key: 'emit',
	    value: function emit(eventName) {
	      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      opts.sourceModel = this.sourceModel;
	      opts.name = this.name;
	      var serviceEventName = this.serviceName + ':' + eventName;

	      this.log('emit', serviceEventName, eventName, opts);
	      this.eventBus.$emit(eventName, opts);
	      this.eventBus.$emit(serviceEventName, opts);
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      throw new Error('BaseHandler Subclass must override clazzName getter');
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.dragHandler;
	    }
	  }, {
	    key: 'indexes',
	    get: function get() {
	      return {
	        indexes: {
	          source: this.dragIndex,
	          target: this.dropIndex
	        }
	      };
	    }
	  }]);
	  return BaseHandler;
	}();

	var DropModelBuilder = function () {
	  function DropModelBuilder(_ref) {
	    var dh = _ref.dh,
	        noCopy = _ref.noCopy;
	    classCallCheck(this, DropModelBuilder);

	    this.dh = dh;
	    this.noCopy = noCopy;
	    this.sourceModel = dh.sourceModel;
	    this.dragIndex = dh.dragIndex;
	  }

	  createClass(DropModelBuilder, [{
	    key: "dropElmModel",
	    value: function dropElmModel() {
	      return this.sourceModel.at(this.dragIndex);
	    }
	  }, {
	    key: "jsonDropElmModel",
	    value: function jsonDropElmModel() {
	      var model = this.dropElmModel();
	      var stringable = model ? model.model || model.stringable : model;
	      return JSON.parse(JSON.stringify(stringable || model));
	    }
	  }, {
	    key: "model",
	    get: function get() {
	      return this.noCopy ? this.dropElmModel() : this.jsonDropElmModel();
	    }
	  }]);
	  return DropModelBuilder;
	}();

	var DropModelHandler = function (_BaseHandler) {
	  inherits(DropModelHandler, _BaseHandler);

	  function DropModelHandler(_ref) {
	    var dh = _ref.dh,
	        ctx = _ref.ctx;
	    classCallCheck(this, DropModelHandler);

	    // delegate methods to modelHandler
	    var _this = possibleConstructorReturn(this, (DropModelHandler.__proto__ || Object.getPrototypeOf(DropModelHandler)).call(this, { dh: dh, ctx: ctx }));

	    var _arr = ['notCopy', 'insertModel', 'cancelDrop'];
	    for (var _i = 0; _i < _arr.length; _i++) {
	      var name = _arr[_i];
	      _this[name] = _this.dh[name].bind(_this.dh);
	    }
	    return _this;
	  }

	  createClass(DropModelHandler, [{
	    key: 'setNoCopy',
	    value: function setNoCopy() {
	      this.noCopy = this.dragElm === this.ctx.element;
	    }
	  }, {
	    key: 'setTargetModel',
	    value: function setTargetModel() {
	      this.targetModel = this.getModel(this.ctx.containers.target);
	    }
	  }, {
	    key: 'setDropModel',
	    value: function setDropModel() {
	      this.dropModel = new DropModelBuilder({
	        dh: this.dh,
	        noCopy: this.noCopy
	      }).model;
	    }
	  }, {
	    key: 'models',
	    value: function models() {
	      this.setTargetModel();
	      this.setDropModel();
	      return {
	        models: {
	          target: this.targetModel,
	          drop: this.dropModel
	        }
	      };
	    }
	  }, {
	    key: 'handle',
	    value: function handle() {
	      this.log('dropModelTarget', this.ctx);
	      this.setNoCopy();

	      var ctx = Object.assign(this.ctx, this.models(), { noCopy: this.noCopy });

	      this.notCopy({ ctx: ctx });
	      this.cancelDrop(ctx);
	      this.insertModel(ctx);
	    }
	  }]);
	  return DropModelHandler;
	}(BaseHandler);

	var DragulaEventHandler = function (_BaseHandler) {
	  inherits(DragulaEventHandler, _BaseHandler);

	  function DragulaEventHandler(_ref) {
	    var dh = _ref.dh,
	        ctx = _ref.ctx,
	        options = _ref.options;
	    classCallCheck(this, DragulaEventHandler);

	    var _this = possibleConstructorReturn(this, (DragulaEventHandler.__proto__ || Object.getPrototypeOf(DragulaEventHandler)).call(this, { dh: dh, ctx: ctx, options: options }));

	    _this.domIndexOf = ctx.domIndexOf.bind(ctx);
	    _this.configDelegates({
	      props: ['dragElm'],
	      methods: ['removeModel', 'dropModel']
	    });
	    return _this;
	  }

	  createClass(DragulaEventHandler, [{
	    key: 'remove',


	    // :: dragula event handler
	    // el was being dragged but it got nowhere and it was removed from the DOM
	    // Its last stable parent was container
	    // originally came from source
	    value: function remove(el, container, source) {
	      this.log('remove', el, container, source);
	      if (!this.drake.models) {
	        this.log('Warning: Can NOT remove it. Must have models:', this.drake.models);
	        return;
	      }

	      var ctx = this.createCtx({ el: el, source: source });
	      this.sourceModel = this.getModel(source); // container
	      this.removeModel(ctx);
	      this.drake.cancel(true);

	      this.emit('removeModel', ctx);
	    }

	    // :: dragula event handler
	    // el was lifted from source

	  }, {
	    key: 'drag',
	    value: function drag(el, source) {
	      this.log('drag', el, source);
	      this.dragElm = el;
	      this.dragIndex = this.domIndexOf(el, source);
	    }

	    // :: dragula event handler
	    // el was dropped into target before a sibling element, and originally came from source

	  }, {
	    key: 'drop',
	    value: function drop(el, target, source, sibling) {
	      this.log('drop', el, target, source);
	      if (!this.drake.models || !target) {
	        this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target);
	        return;
	      }
	      this.dropIndex = this.domIndexOf(el, target);
	      this.sourceModel = this.getModel(source); // container

	      var ctx = this.createCtx({ el: el, target: target, source: source });
	      this.dropModel(ctx);

	      this.emit('dropModel', ctx);
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'DragulaEventHandler';
	    }
	  }]);
	  return DragulaEventHandler;
	}(BaseHandler);

	var raf = window.requestAnimationFrame;
	var waitForTransition = raf ? function (fn) {
	  raf(function () {
	    raf(fn);
	  });
	} : function (fn) {
	  window.setTimeout(fn, 50);
	};

	var ModelHandler = function (_BaseHandler) {
	  inherits(ModelHandler, _BaseHandler);

	  function ModelHandler(_ref) {
	    var dh = _ref.dh,
	        ctx = _ref.ctx,
	        options = _ref.options;
	    classCallCheck(this, ModelHandler);
	    return possibleConstructorReturn(this, (ModelHandler.__proto__ || Object.getPrototypeOf(ModelHandler)).call(this, { dh: dh, ctx: ctx, options: options }));
	  }

	  createClass(ModelHandler, [{
	    key: 'context',
	    value: function context(ctx) {
	      return Object.assign(ctx, this.models, this.indexes);
	    }
	  }, {
	    key: 'dropModel',
	    value: function dropModel(ctx) {
	      var _ctx = ctx,
	          containers = _ctx.containers;

	      this.log('dropModel', ctx);
	      ctx = Object.assign(ctx, this.indexes);

	      containers.target === containers.source ? this.dropModelSame(ctx) : this.dropModelTarget(ctx);
	    }
	  }, {
	    key: 'removeModel',
	    value: function removeModel(ctx) {
	      ctx = this.context(ctx);
	      this.log('removeModel', ctx);
	      this.sourceModel.removeAt(ctx);
	    }
	  }, {
	    key: 'dropModelSame',
	    value: function dropModelSame(ctx) {
	      ctx = this.context(ctx);
	      this.log('dropModelSame', ctx);
	      this.sourceModel.move(ctx);
	    }
	  }, {
	    key: 'insertModel',
	    value: function insertModel(ctx) {
	      ctx = this.context(ctx);
	      this.log('insertModel', ctx);
	      this.targetModel.insertAt(ctx);
	      this.emit('insertAt', ctx);
	    }
	  }, {
	    key: 'notCopy',
	    value: function notCopy(_ref2) {
	      var _this2 = this;

	      var ctx = _ref2.ctx;

	      if (!ctx.noCopy) return;
	      waitForTransition(function () {
	        ctx = _this2.context(ctx);
	        _this2.sourceModel.removeAt(ctx);
	      });
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ModelHandler';
	    }
	  }, {
	    key: 'models',
	    get: function get() {
	      return {
	        models: {
	          source: this.sourceModel
	        }
	      };
	    }
	  }]);
	  return ModelHandler;
	}(BaseHandler);

	function createModelHandler(_ref) {
	  var dh = _ref.dh,
	      options = _ref.options;

	  var factory = options.createModelHandler || defaults$2.createModelHandler;
	  return factory(dh, options);
	}

	function createDragulaEventHandler(_ref2) {
	  var dh = _ref2.dh,
	      options = _ref2.options;

	  var factory = options.createDragulaEventHandler || defaults$2.DragulaEventHandler;
	  return factory(dh, options);
	}

	var DragHandler = function (_BaseHandler) {
	  inherits(DragHandler, _BaseHandler);

	  function DragHandler(_ref3) {
	    var ctx = _ref3.ctx,
	        name = _ref3.name,
	        drake = _ref3.drake,
	        options = _ref3.options;
	    classCallCheck(this, DragHandler);

	    var _this = possibleConstructorReturn(this, (DragHandler.__proto__ || Object.getPrototypeOf(DragHandler)).call(this, { ctx: ctx, options: options }));

	    _this.dragIndex = null;
	    _this.dropIndex = null;
	    _this.sourceModel = null;

	    _this.dragElm = null;
	    _this.drake = drake;
	    _this.name = name;

	    var args = { dh: _this, ctx: ctx, options: options };
	    _this.modelHandler = createModelHandler(args);
	    _this.dragulaEventHandler = createDragulaEventHandler(args);

	    // delegate methods to modelHandler
	    var _arr = ['removeModel', 'insertModel', 'notCopy', 'dropModelSame'];
	    for (var _i = 0; _i < _arr.length; _i++) {
	      var _name = _arr[_i];
	      _this[_name] = _this.modelHandler[_name].bind(_this.modelHandler);
	    }

	    // delegate methods to dragulaEventHandler
	    var _arr2 = ['remove', 'drag', 'drop'];
	    for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
	      var _name2 = _arr2[_i2];
	      _this[_name2] = _this.dragulaEventHandler[_name2].bind(_this.dragulaEventHandler);
	    }
	    return _this;
	  }

	  createClass(DragHandler, [{
	    key: 'getModel',
	    value: function getModel(container) {
	      return this.modelManager.createFor({
	        name: this.name,
	        drake: this.drake,
	        logging: this.logging,
	        model: this.findModelForContainer(container, this.drake)
	      });
	    }
	  }, {
	    key: 'cancelDrop',
	    value: function cancelDrop(ctx) {
	      if (this.targetModel) return;
	      this.log('No targetModel could be found for target:', ctx.containers.target, ctx);
	      this.log('in drake:', this.drake);
	      this.drake.cancel(true);
	    }
	  }, {
	    key: 'dropModelTarget',
	    value: function dropModelTarget(ctx) {
	      new DropModelHandler({ dh: this, ctx: ctx }).handle();
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'DragHandler';
	    }
	  }]);
	  return DragHandler;
	}(BaseHandler);

	var ModelManager = function () {
	  function ModelManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ModelManager);

	    if (Array.isArray(opts)) {
	      opts = {
	        model: opts
	      };
	    }
	    this.opts = opts;
	    this.name = opts.name;
	    this.drake = opts.drake;
	    this.groupProp = opts.groupProp || 'group';

	    this.modelRef = opts.model || [];
	    this.model = this.createModel(this.modelRef);

	    this.logging = opts.logging;
	    this.log('CREATE', opts);
	  }

	  createClass(ModelManager, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.log('undo', 'not yet implemented');
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.log('redo', 'not yet implemented');
	    }
	  }, {
	    key: 'at',
	    value: function at(index) {
	      return this.model.get ? this.model.get(index) : this.model[index];
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.model = this.createModel();
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel(model) {
	      return this.model || model || [];
	    }
	  }, {
	    key: 'createFor',
	    value: function createFor() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return new ModelManager(opts);
	    }
	  }, {
	    key: 'removeAt',
	    value: function removeAt(_ref) {
	      var indexes = _ref.indexes;

	      var index = indexes.drag;
	      this.log('removeAt', {
	        model: this.model,
	        index: index
	      });
	      return this.model.splice(index, 1);
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(_ref2) {
	      var indexes = _ref2.indexes,
	          models = _ref2.models;

	      var index = indexes.drop;
	      var dropModel = models.transit;
	      this.log('insertAt', {
	        model: this.model,
	        index: index,
	        dropModel: dropModel
	      });
	      return this.model.splice(index, 0, dropModel);
	    }
	  }, {
	    key: 'move',
	    value: function move(_ref3) {
	      var indexes = _ref3.indexes;

	      this.log('move', {
	        model: this.model,
	        indexes: indexes
	      });
	      var insertModel = this.model.splice(indexes.drag, 1)[0];
	      return this.model.splice(indexes.drop, 0, insertModel);
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ModelManager';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.modelManager;
	    }
	  }]);
	  return ModelManager;
	}();

	var defaults$2 = {
	  createDragHandler: function createDragHandler(_ref) {
	    var ctx = _ref.ctx,
	        name = _ref.name,
	        drake = _ref.drake;

	    return new DragHandler({ ctx: ctx, name: name, drake: drake });
	  },
	  createModelManager: function createModelManager(opts) {
	    return new ModelManager(opts);
	  },
	  createModelHandler: function createModelHandler(_ref2) {
	    var ctx = _ref2.ctx,
	        name = _ref2.name,
	        drake = _ref2.drake,
	        options = _ref2.options;

	    return new ModelHandler({ ctx: ctx, name: name, drake: drake, options: options });
	  }
	};

	if (!dragula$1) {
	  throw new Error('[vue-dragula] cannot locate dragula.');
	}

	var createDragHandler = defaults$2.createDragHandler;
	var createModelManager = defaults$2.createModelManager;
	var DragulaService = function () {
	  function DragulaService() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, DragulaService);
	    var name = opts.name,
	        eventBus = opts.eventBus,
	        drakes = opts.drakes,
	        options = opts.options;

	    this.opts = opts;
	    options = options || {};
	    this.options = options;
	    this.logging = options.logging;

	    this.log('CREATE DragulaService', opts);

	    this.name = name;
	    this.drakes = drakes || {}; // drake store
	    this.eventBus = eventBus;
	    this.createDragHandler = options.createDragHandler || createDragHandler;
	    this.createModelManager = options.createModelManager || createModelManager;

	    this.modelManager = this.createModelManager(options);

	    this.events = ['cancel', 'cloned', 'drag', 'dragend', 'drop', 'out', 'over', 'remove', 'shadow', 'dropModel', 'removeModel'];

	    this.validate();
	  }

	  createClass(DragulaService, [{
	    key: 'validate',
	    value: function validate() {
	      if (!this.eventBus) {
	        this.error('Missing eventBus', this.opts);
	      }

	      if (!this.modelManager) {
	        this.error('Missing modelManager', this.opts);
	      }

	      if (!this.drakes) {
	        this.error('Missing drakes', this.opts);
	      }
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel() {
	      return this.modelManager.createModel();
	    }
	  }, {
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, ['DragulaService [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'error',
	    value: function error(msg) {
	      var _console2;

	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      (_console2 = console).error.apply(_console2, [msg].concat(args));
	      throw new Error(msg);
	    }
	  }, {
	    key: '_validate',
	    value: function _validate(method, name) {
	      if (!name) {
	        this.error(method + ' must take a drake name as the first argument');
	      }
	    }
	  }, {
	    key: 'add',
	    value: function add(name, drake) {
	      this.log('add (drake)', name, drake);
	      this._validate('add', name);
	      if (this.find(name)) {
	        this.log('existing drakes', this.drakeNames);
	        var errMsg = 'Drake named: "' + name + '" already exists for this service [' + this.name + '].\n      Most likely this error in cause by a race condition evaluating multiple template elements with\n      the v-dragula directive having the same drake name. Please initialise the drake in the created() life cycle hook of the VM to fix this problem.';
	        this.error(errMsg);
	      }

	      this.drakes[name] = drake;
	      if (drake.models) {
	        this.handleModels(name, drake);
	      }
	      if (!drake.initEvents) {
	        this.setupEvents(name, drake);
	      }
	      return drake;
	    }
	  }, {
	    key: 'find',
	    value: function find(name) {
	      this.log('find (drake) by name', name);
	      this._validate('find', name);
	      return this.drakes[name];
	    }
	  }, {
	    key: 'handleModels',
	    value: function handleModels(name, drake) {
	      this.log('handleModels', name, drake);
	      this._validate('handleModels', name);
	      if (drake.registered) {
	        // do not register events twice
	        this.log('handleModels', 'already registered');
	        return;
	      }

	      var dragHandler = this.createDragHandler({ ctx: this, name: name, drake: drake });
	      this.log('created dragHandler for service', dragHandler);

	      drake.on('remove', dragHandler.remove.bind(dragHandler));
	      drake.on('drag', dragHandler.drag.bind(dragHandler));
	      drake.on('drop', dragHandler.drop.bind(dragHandler));

	      drake.registered = true;
	    }

	    // convenience to set eventBus handlers via Object

	  }, {
	    key: 'on',
	    value: function on() {
	      var handlerConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      this.log('on (events) ', handlerConfig);
	      var handlerNames = Object.keys(handlerConfig);

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = handlerNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var handlerName = _step.value;

	          var handlerFunction = handlerConfig[handlerName];
	          this.log('$on', handlerName, handlerFunction);
	          this.eventBus.$on(handlerName, handlerFunction);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy(name) {
	      this.log('destroy (drake) ', name);
	      this._validate('destroy', name);
	      var drake = this.find(name);
	      if (!drake) {
	        return;
	      }
	      drake.destroy();
	      this._delete(name);
	    }
	  }, {
	    key: '_delete',
	    value: function _delete(name) {
	      delete this.drakes[name];
	    }
	  }, {
	    key: 'setOptions',
	    value: function setOptions(name, options) {
	      this.log('setOptions (drake)', name, options);
	      this._validate('setOptions', name);
	      var drake = this.add(name, dragula$1(options));
	      this.handleModels(name, drake);
	      return this;
	    }
	  }, {
	    key: 'setupEvents',
	    value: function setupEvents(name, drake) {
	      this.log('setupEvents', name, drake);
	      this._validate('setupEvents', name);
	      drake.initEvents = true;
	      var _this = this;

	      function calcOpts(name, args) {
	        switch (name) {
	          case 'cloned':
	            return { clone: args[0], original: args[1], type: args[2] };

	          case 'drag':
	            return { el: args[0], source: args[1] };

	          case 'dragend':
	            return { el: args[0] };

	          case 'drop':
	            return {
	              el: args[0],
	              target: args[1],
	              source: args[2],
	              sibling: args[3]
	            };

	          default:
	            return {
	              el: args[0],
	              container: args[1],
	              source: args[2]
	            };
	        }
	      }

	      var emitter = function emitter(type) {
	        _this.log('emitter', type);

	        function replicate() {
	          var args = Array.prototype.slice.call(arguments);
	          // let sendArgs = [name].concat(args)
	          var opts = calcOpts(name, args);
	          opts.name = name;
	          opts.service = this;
	          opts.drake = drake;
	          _this.log('eventBus.$emit', type, name, opts);
	          _this.eventBus.$emit(type, opts);
	          _this.eventBus.$emit(this.name + ':' + type, opts);
	        }

	        drake.on(type, replicate);
	      };
	      this.events.forEach(emitter);
	    }
	  }, {
	    key: 'domIndexOf',
	    value: function domIndexOf(child, parent) {
	      return Array.prototype.indexOf.call(parent.children, child);
	    }
	  }, {
	    key: 'findModelForContainer',
	    value: function findModelForContainer(container, drake) {
	      this.log('findModelForContainer', container, drake);
	      return (this.findModelContainer(container, drake) || {}).model;
	    }
	  }, {
	    key: 'findModelContainer',
	    value: function findModelContainer(container, drake) {
	      if (!drake.models) {
	        this.log('findModelContainer', 'warning: no models found');
	        return;
	      }
	      var found = drake.models.find(function (model) {
	        return model.container === container;
	      });
	      if (!found) {
	        this.log('No matching model could be found for container:', container);
	        this.log('in drake', drake.name, ' models:', drake.models);
	      }
	      return found;
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.service;
	    }
	  }, {
	    key: 'drakeNames',
	    get: function get() {
	      return Object.keys(this.drakes);
	    }
	  }]);
	  return DragulaService;
	}();

	var TimeMachine = function () {
	  function TimeMachine(_ref) {
	    var name = _ref.name,
	        model = _ref.model,
	        modelRef = _ref.modelRef,
	        history = _ref.history,
	        logging = _ref.logging;
	    classCallCheck(this, TimeMachine);

	    this.name = name || 'default';
	    this.model = model;
	    this.modelRef = modelRef;
	    this.logging = logging;
	    this.history = history || this.createHistory();
	    this.history.push(this.model);
	    this.timeIndex = 0;
	  }

	  createClass(TimeMachine, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'createHistory',
	    value: function createHistory() {
	      return this.history || [];
	    }
	  }, {
	    key: 'timeTravel',
	    value: function timeTravel(index) {
	      this.log('timeTravel to', index);
	      this.model = this.history[index];
	      this.updateModelRef();
	      return this;
	    }
	  }, {
	    key: 'updateModelRef',
	    value: function updateModelRef() {
	      // this.modelRef = mutable
	      // this.log('set modelRef', this.modelRef, this.model)
	      this.modelRef.splice(0, this.modelRef.length);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.model[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var item = _step.value;

	          this.modelRef.push(item);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.log('undo timeIndex', this.timeIndex);
	      if (this.timeIndex === 0) {
	        return false;
	      }
	      this.timeIndex--;
	      this.timeTravel(this.timeIndex);
	      return this;
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.log('redo timeIndex', this.timeIndex, this.history.length);
	      if (this.timeIndex > this.history.length - 1) {
	        return false;
	      }
	      this.timeIndex++;
	      this.timeTravel(this.timeIndex);
	      return this;
	    }
	  }, {
	    key: 'addToHistory',
	    value: function addToHistory(newModel) {
	      this.log('addToHistory');
	      this.log('old', this.model);
	      this.log('new', newModel);
	      this.model = newModel;
	      this.log('model was set to', this.model);
	      this.history.push(newModel);
	      this.timeIndex++;
	      this.updateModelRef();
	      return this;
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.modelManager;
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'TimeMachine';
	    }
	  }]);
	  return TimeMachine;
	}();

	var defaults$1 = {
	  createTimeMachine: function createTimeMachine(opts) {
	    return new TimeMachine(opts);
	  },
	  createService: function createService(_ref) {
	    var name = _ref.name,
	        eventBus = _ref.eventBus,
	        drakes = _ref.drakes,
	        options = _ref.options;

	    // log('default createService', {name, eventBus, drakes, options})
	    return new DragulaService({
	      name: name,
	      eventBus: eventBus,
	      drakes: drakes,
	      options: options
	    });
	  }
	};

	var ServiceManager = function () {
	  function ServiceManager(_ref) {
	    var Vue = _ref.Vue,
	        options = _ref.options,
	        eventBus = _ref.eventBus,
	        log = _ref.log;
	    classCallCheck(this, ServiceManager);

	    this.log = log.dir;
	    this.Vue = Vue;
	    this.options = options;
	    this.buildService = options.createService || defaults$1.createService;
	    this.createEventbus();

	    // global service
	    this.appService = this.buildService({
	      name: 'global.dragula',
	      eventBus: this.eventBus,
	      drakes: options.drakes,
	      options: options
	    });
	  }

	  createClass(ServiceManager, [{
	    key: 'createEventbus',
	    value: function createEventbus() {
	      var eventBusFactory = this.options.createEventBus || dirDefaults.createEventBus;
	      this.eventBus = eventBusFactory(this.Vue, this.options) || new this.Vue();
	      if (!this.eventBus) {
	        console.warn('Eventbus could not be created');
	        throw new Error('Eventbus could not be created');
	      }
	    }
	  }, {
	    key: 'findService',
	    value: function findService(name, vnode, serviceName) {
	      // first try to register on DragulaService of component
	      if (vnode) {
	        var dragula = vnode.context.$dragula;
	        if (dragula) {
	          this.log('trying to find and use component service');

	          var componentService = dragula.service(serviceName);
	          if (componentService) {
	            this.log('using component service', componentService);
	            return componentService;
	          }
	        }
	      }
	      this.log('using global service', this.appService);
	      return this.appService;
	    }
	  }]);
	  return ServiceManager;
	}();

	function isObject(obj) {
	  return obj === Object(obj);
	}

	var Dragula = function () {
	  function Dragula(_ref) {
	    var serviceManager = _ref.serviceManager,
	        log = _ref.log;
	    classCallCheck(this, Dragula);
	    var appService = serviceManager.appService,
	        buildService = serviceManager.buildService;

	    console.log('Dragula', { serviceManager: serviceManager, log: log });
	    this.appService = appService;
	    this.buildService = buildService;
	    this.log = log.serviceConfig;
	    this.options = appService.options;

	    // convenience functions on global service
	    this.$service = {
	      options: appService.setOptions.bind(appService),
	      find: appService.find.bind(appService),
	      eventBus: appService.eventBus
	    };
	    // add default drake on global app service
	    this.$service.options('default', {});

	    // alias
	    this.createServices = this.createService;
	  }

	  createClass(Dragula, [{
	    key: 'optionsFor',
	    value: function optionsFor(name) {
	      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      this.service(name).setOptions(opts);
	      return this;
	    }
	  }, {
	    key: 'createService',
	    value: function createService() {
	      var serviceOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      this.log('createService', serviceOpts);

	      this._serviceMap = this._serviceMap || {};

	      var names = serviceOpts.names || [];
	      var name = serviceOpts.name || [];
	      var drakes = serviceOpts.drakes || {};
	      var drake = serviceOpts.drake;
	      var opts = Object.assign({}, this.options, serviceOpts);
	      names = names.length > 0 ? names : [name];
	      var eventBus = serviceOpts.eventBus || this.appService.eventBus;
	      if (!eventBus) {
	        console.warn('Eventbus could not be created', eventBus);
	      }

	      this.log('names', names);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _name = _step.value;

	          var createOpts = {
	            name: _name,
	            eventBus: eventBus,
	            options: opts
	          };
	          this.log('create DragulaService', _name, createOpts);
	          this._serviceMap[_name] = this.buildService(createOpts);

	          // use 'default' drakes if none specified
	          if (!drakes.default) {
	            drakes.default = drake || true;
	          }

	          this.drakesFor(_name, drakes);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      return this;
	    }
	  }, {
	    key: 'drakesFor',
	    value: function drakesFor(name) {
	      var drakes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      this.log('drakesFor', name, drakes);
	      var service = this.service(name);

	      if (Array.isArray(drakes)) {
	        // turn Array into object of [name]: true
	        drakes = drakes.reduce(function (obj, name) {
	          obj[name] = true;
	          return obj;
	        }, {});
	      }

	      var drakeNames = Object.keys(drakes);
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = drakeNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var drakeName = _step2.value;

	          var drakeOpts = drakes[drakeName];
	          if (drakeOpts === true) {
	            drakeOpts = {};
	          }

	          service.setOptions(drakeName, drakeOpts);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      return this;
	    }
	  }, {
	    key: 'on',
	    value: function on(name) {
	      var handlerConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      this.log('on', name, handlerConfig);
	      if (isObject(name)) {
	        handlerConfig = name;
	        // add event handlers for all services
	        var serviceNames = this.serviceNames;

	        if (!serviceNames || serviceNames.length < 1) {
	          console.warn('vue-dragula: No services found to add events handlers for', this._serviceMap);
	          return this;
	        }

	        this.log('add event handlers for', serviceNames);
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;

	        try {
	          for (var _iterator3 = serviceNames[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var serviceName = _step3.value;

	            this.on(serviceName, handlerConfig);
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }

	        return this;
	      }

	      var service = this.service(name);
	      if (!service) {
	        console.warn('vue-dragula: no service ' + name + ' to add event handlers for');
	        return this;
	      }
	      this.log('service.on', service, handlerConfig);
	      service.on(handlerConfig);
	      return this;
	    }
	  }, {
	    key: 'service',


	    // return named service or first service
	    value: function service(name) {
	      if (!this._serviceMap) return;

	      var found = this._serviceMap[name];
	      this.log('lookup service', name, found);

	      if (!found) {
	        this.log('not found by name, get default');
	        var keys = this.serviceNames;
	        if (keys) {
	          found = this._serviceMap[keys[0]];
	        }
	      }
	      return found;
	    }
	  }, {
	    key: 'serviceNames',
	    get: function get() {
	      return Object.keys(this._serviceMap);
	    }
	  }, {
	    key: 'services',
	    get: function get() {
	      return Object.values(this._serviceMap);
	    }
	  }]);
	  return Dragula;
	}();

	function isEmpty(str) {
	  if (!str) return true;
	  if (str.length === 0) return true;
	  return false;
	}

	function calcNames(name, vnode, ctx) {
	  var drakeName = vnode ? vnode.data.attrs.drake // Vue 2
	  : ctx.params.drake; // Vue 1

	  var serviceName = vnode ? vnode.data.attrs.service // Vue 2
	  : ctx.params.service; // Vue 1

	  if (drakeName !== undefined && drakeName.length !== 0) {
	    name = drakeName;
	  }
	  drakeName = isEmpty(drakeName) ? 'default' : drakeName;

	  return { name: name, drakeName: drakeName, serviceName: serviceName };
	}

	var Base = function () {
	  function Base(_ref) {
	    var serviceManager = _ref.serviceManager,
	        name = _ref.name,
	        log = _ref.log;
	    classCallCheck(this, Base);

	    this.serviceManager = serviceManager;
	    this.globalName = name;
	    this.log = log.dir;
	  }

	  createClass(Base, [{
	    key: 'extractAll',
	    value: function extractAll(_ref2) {
	      var container = _ref2.container,
	          vnode = _ref2.vnode,
	          ctx = _ref2.ctx;

	      var _calcNames = calcNames(this.globalName, vnode, ctx),
	          name = _calcNames.name,
	          drakeName = _calcNames.drakeName,
	          serviceName = _calcNames.serviceName;

	      var service = this.serviceManager.findService(name, vnode, serviceName);
	      var drake = service.find(drakeName, vnode);

	      if (!service) {
	        this.log('no service found', name, drakeName);
	        return;
	      }

	      return { drake: drake, service: service, name: name, drakeName: drakeName, serviceName: serviceName };
	    }
	  }]);
	  return Base;
	}();

	var Updater = function (_Base) {
	  inherits(Updater, _Base);

	  function Updater(_ref) {
	    var serviceManager = _ref.serviceManager,
	        name = _ref.name,
	        log = _ref.log;
	    classCallCheck(this, Updater);

	    var _this = possibleConstructorReturn(this, (Updater.__proto__ || Object.getPrototypeOf(Updater)).call(this, { serviceManager: serviceManager, name: name, log: log }));

	    _this.drakeContainers = {};
	    _this.execute = _this.update.bind(_this);
	    return _this;
	  }

	  createClass(Updater, [{
	    key: 'update',
	    value: function update(_ref2) {
	      var newValue = _ref2.newValue,
	          container = _ref2.container,
	          vnode = _ref2.vnode,
	          ctx = _ref2.ctx;

	      this.log('updateDirective');

	      var _babelHelpers$get$cal = get(Updater.prototype.__proto__ || Object.getPrototypeOf(Updater.prototype), 'extractAll', this).call(this, { vnode: vnode, ctx: ctx }),
	          service = _babelHelpers$get$cal.service,
	          drake = _babelHelpers$get$cal.drake,
	          drakeName = _babelHelpers$get$cal.drakeName,
	          serviceName = _babelHelpers$get$cal.serviceName;

	      this.drakeContainers[drakeName] = this.drakeContainers[drakeName] || [];
	      var drakeContainer = this.drakeContainers[drakeName];

	      if (!drake.models) {
	        drake.models = [];
	      }

	      if (!vnode) {
	        container = this.el; // Vue 1
	      }

	      var modelContainer = service.findModelContainer(container, drake);

	      drakeContainer.push(container);

	      this.log('DATA', {
	        service: {
	          name: serviceName,
	          instance: service
	        },
	        drake: {
	          name: drakeName,
	          instance: drake
	        },
	        container: container,
	        modelContainer: modelContainer
	      });

	      if (modelContainer) {
	        this.log('set model of container', newValue);
	        modelContainer.model = newValue;
	      } else {
	        this.log('push model and container on drake', newValue, container);
	        drake.models.push({
	          model: newValue,
	          container: container
	        });
	      }
	    }
	  }]);
	  return Updater;
	}(Base);

	var Binder = function (_Base) {
	  inherits(Binder, _Base);

	  function Binder(_ref) {
	    var serviceManager = _ref.serviceManager,
	        name = _ref.name,
	        log = _ref.log;
	    classCallCheck(this, Binder);

	    var _this = possibleConstructorReturn(this, (Binder.__proto__ || Object.getPrototypeOf(Binder)).call(this, { serviceManager: serviceManager, name: name, log: log }));

	    _this.execute = _this['bind'].bind(_this);
	    return _this;
	  }

	  createClass(Binder, [{
	    key: 'bind',
	    value: function bind(_ref2) {
	      var container = _ref2.container,
	          vnode = _ref2.vnode,
	          ctx = _ref2.ctx;

	      var _babelHelpers$get$cal = get(Binder.prototype.__proto__ || Object.getPrototypeOf(Binder.prototype), 'extractAll', this).call(this, { vnode: vnode, ctx: ctx }),
	          service = _babelHelpers$get$cal.service,
	          drake = _babelHelpers$get$cal.drake,
	          name = _babelHelpers$get$cal.name,
	          drakeName = _babelHelpers$get$cal.drakeName,
	          serviceName = _babelHelpers$get$cal.serviceName;

	      if (!vnode) {
	        container = this.el; // Vue 1
	      }

	      this.log({
	        service: {
	          name: serviceName,
	          instance: service
	        },
	        drake: {
	          name: drakeName,
	          instance: drake
	        },
	        container: container
	      });

	      if (drake) {
	        drake.containers.push(container);
	        return;
	      }
	      var newDrake = dragula$1({
	        containers: [container]
	      });
	      service.add(name, newDrake);

	      service.handleModels(name, newDrake);
	    }
	  }]);
	  return Binder;
	}(Base);

	var UnBinder = function (_Base) {
	  inherits(UnBinder, _Base);

	  function UnBinder(_ref) {
	    var serviceManager = _ref.serviceManager,
	        name = _ref.name,
	        log = _ref.log;
	    classCallCheck(this, UnBinder);

	    var _this = possibleConstructorReturn(this, (UnBinder.__proto__ || Object.getPrototypeOf(UnBinder)).call(this, { serviceManager: serviceManager, name: name, log: log }));

	    _this.execute = _this.unbind.bind(_this);
	    return _this;
	  }

	  createClass(UnBinder, [{
	    key: 'unbind',
	    value: function unbind(_ref2) {
	      var container = _ref2.container,
	          binding = _ref2.binding,
	          vnode = _ref2.vnode,
	          ctx = _ref2.ctx;

	      var _babelHelpers$get$cal = get(UnBinder.prototype.__proto__ || Object.getPrototypeOf(UnBinder.prototype), 'extractAll', this).call(this, { vnode: vnode, ctx: ctx }),
	          service = _babelHelpers$get$cal.service,
	          drake = _babelHelpers$get$cal.drake,
	          name = _babelHelpers$get$cal.name,
	          drakeName = _babelHelpers$get$cal.drakeName,
	          serviceName = _babelHelpers$get$cal.serviceName;

	      this.log({
	        service: {
	          name: serviceName,
	          instance: service
	        },
	        drake: {
	          name: drakeName,
	          instance: drake
	        },
	        container: container
	      });

	      if (!drake) {
	        return;
	      }

	      var containerIndex = drake.containers.indexOf(container);

	      if (containerIndex > -1) {
	        this.log('remove container', containerIndex);
	        drake.containers.splice(containerIndex, 1);
	      }

	      if (drake.containers.length === 0) {
	        this.log('destroy service');
	        service.destroy(name);
	      }
	    }
	  }]);
	  return UnBinder;
	}(Base);

	function capitalize(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var Creator = function () {
	  // TODO: Allow for customisation via options containing factory methods
	  function Creator(_ref) {
	    var Vue = _ref.Vue,
	        serviceManager = _ref.serviceManager,
	        _ref$name = _ref.name,
	        name = _ref$name === undefined ? 'globalDrake' : _ref$name,
	        options = _ref.options,
	        log = _ref.log;
	    classCallCheck(this, Creator);

	    this.name = name;
	    this.Vue = Vue;
	    this.log = log.dir;
	    this.options = options;
	    this.execute = this.create.bind(this);

	    this.default = {
	      args: { serviceManager: serviceManager, name: name, log: log },
	      updater: Updater,
	      binder: Binder,
	      unbinder: UnBinder
	    };

	    this.updater = this.createDirClass('updater', options);
	    this.binder = this.createDirClass('binder', options);
	    this.unbinder = this.createDirClass('unbinder', options);
	  }

	  // Allow options to have custom factory methods:
	  // - updater
	  // - binder
	  // - unbinder


	  createClass(Creator, [{
	    key: 'createDirClass',
	    value: function createDirClass(name, options) {
	      var _this = this;

	      var DefaultClazz = this.default[name];
	      var defaultCreator = function defaultCreator() {
	        return new DefaultClazz(_this.default.args);
	      };
	      var factoryFunctionName = 'create' + capitalize(name);
	      var customFun = this.options.directive ? this.options.directive[factoryFunctionName] : null;
	      var updaterClazz = customFun || defaultCreator;
	      return updaterClazz(this.default.args);
	    }
	  }, {
	    key: 'updateDirective',
	    value: function updateDirective(_ref2) {
	      var container = _ref2.container,
	          binding = _ref2.binding,
	          vnode = _ref2.vnode,
	          oldVnode = _ref2.oldVnode,
	          ctx = _ref2.ctx;

	      var newValue = vnode ? binding.value // Vue 2
	      : container; // Vue 1
	      if (!newValue) {
	        return;
	      }

	      this.updater.execute({ container: container, vnode: vnode, binding: binding, newValue: newValue, oldVnode: oldVnode, ctx: ctx });
	    }
	  }, {
	    key: 'create',
	    value: function create() {
	      var that = this;

	      this.Vue.directive('dragula', {
	        params: ['drake', 'service'],

	        bind: function bind(container, binding, vnode) {
	          that.log('BIND', container, binding, vnode);

	          that.binder.execute({ container: container, binding: binding, vnode: vnode, ctx: that });
	        },
	        update: function update(container, binding, vnode, oldVnode) {
	          that.log('UPDATE', container, binding, vnode);
	          // Vue 1
	          if (that.Vue.version === 1) {
	            that.updateDirective({ container: container, binding: binding, vnode: vnode, oldVnode: oldVnode, ctx: that });
	          }
	        },
	        componentUpdated: function componentUpdated(container, binding, vnode, oldVnode) {
	          that.log('COMPONENT UPDATED', container, binding, vnode);
	        },
	        inserted: function inserted(container, binding, vnode, oldVnode) {
	          that.log('INSERTED', container, binding, vnode);
	          // Vue 2
	          that.updateDirective({ container: container, binding: binding, vnode: vnode, oldVnode: oldVnode, ctx: that });
	        },
	        unbind: function unbind(container, binding, vnode) {
	          that.log('UNBIND', container, binding, vnode);
	          that.unbinder.execute({ container: container, binding: binding, vnode: vnode, ctx: that });
	        }
	      });
	    }
	  }]);
	  return Creator;
	}();

	var Logger = function () {
	  function Logger(options) {
	    classCallCheck(this, Logger);

	    console.log('Logger', options);
	    this.options = options;
	    this.logging = options.logging || options;
	  }

	  createClass(Logger, [{
	    key: 'plugin',
	    value: function plugin() {
	      var _console;

	      if (!this.logging) return;
	      if (!this.logging.plugin) return;

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, ['vue-dragula plugin'].concat(args));
	    }
	  }, {
	    key: 'serviceConfig',
	    value: function serviceConfig() {
	      var _console2;

	      if (!this.logging) return;
	      if (!this.logging.service) return;

	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      (_console2 = console).log.apply(_console2, ['vue-dragula service config: '].concat(args));
	    }
	  }, {
	    key: 'dir',
	    value: function dir() {
	      var _console3;

	      if (!this.logging) return;
	      if (!this.logging.directive) return;

	      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      (_console3 = console).log.apply(_console3, ['v-dragula directive'].concat(args));
	    }
	  }]);
	  return Logger;
	}();

	// function log (...msg) {
	//   console.log(...msg)
	// }

	var dirDefaults = {
	  createEventBus: function createEventBus(Vue) {
	    // log('default createEventBus', Vue)
	    return new Vue();
	  },
	  createServiceManager: function createServiceManager(_ref) {
	    var Vue = _ref.Vue,
	        options = _ref.options,
	        log = _ref.log;

	    return new ServiceManager({ Vue: Vue, options: options, log: log });
	  },
	  createLogger: function createLogger(options) {
	    return new Logger(options);
	  },
	  createDragula: function createDragula(_ref2) {
	    var serviceManager = _ref2.serviceManager,
	        log = _ref2.log;

	    return new Dragula({ serviceManager: serviceManager, log: log });
	  },
	  createCreator: function createCreator(_ref3) {
	    var Vue = _ref3.Vue,
	        serviceManager = _ref3.serviceManager,
	        options = _ref3.options,
	        log = _ref3.log;

	    return new Creator({ Vue: Vue, serviceManager: serviceManager, options: options, log: log });
	  }
	};

	if (!dragula$1) {
	  throw new Error('[vue-dragula] cannot locate dragula.');
	}

	function VueDragula(Vue) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  // set full fine-grained logging if true
	  if (options.logging === true) {
	    options.logging = options.defaultLogsOn || {
	      plugin: true,
	      directive: true,
	      service: true,
	      dragHandler: true,
	      modelManager: true
	    };
	  }
	  var logFactory = options.createLogger || dirDefaults.createLogger;
	  var log = logFactory(options);
	  log.plugin('Init: vue-dragula plugin', options);

	  var serviceManagerFactory = options.createServiceManager || dirDefaults.createServiceManager;
	  var serviceManager = serviceManagerFactory({ Vue: Vue, options: options, log: log });

	  var dragulaFactory = options.createDragula || dirDefaults.createDragula;
	  Vue.$dragula = dragulaFactory({ serviceManager: serviceManager, log: log });

	  Vue.prototype.$dragula = Vue.$dragula;

	  var customFacFun = options.directive ? options.directive.createCreator : null;
	  var creatorFactory = customFacFun || dirDefaults.createCreator;
	  var creator = creatorFactory({ Vue: Vue, serviceManager: serviceManager, options: options, log: log });
	  creator.execute();
	}

	var ActionManager = function () {
	  function ActionManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ActionManager);

	    this.name = opts.name || 'default';
	    this.logging = opts.logging;
	    this.observer = {
	      undo: function undo(action) {},
	      redo: function redo(action) {}
	    };

	    this.actions = {
	      // stack of actions to undo
	      done: [],
	      // stack of actions undone to be redone(via. redo)
	      undone: []
	    };
	  }

	  createClass(ActionManager, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.actions.done = [];
	      this.actions.undone = [];
	    }

	    // perform undo/redo on model (container)

	  }, {
	    key: 'doAct',
	    value: function doAct(container, action) {
	      var actFun = container[action].bind(container);
	      // this.log('doAct', actFun, container, action)
	      if (!actFun) {
	        throw new Error(container, 'missing', action, 'method');
	      }
	      actFun();
	    }
	  }, {
	    key: 'do',
	    value: function _do(_ref) {
	      var name = _ref.name,
	          container = _ref.container;

	      // this.log(name)
	      var cDo = container.do;
	      var cUndo = container.undo;
	      if (!cDo.length) {
	        // this.log('actions empty', cDo)
	        return;
	      }
	      var action = cDo.pop();
	      // TODO: use elements, indexes to create visual transition/animation effect
	      var models = action.models;

	      this.log(name, action);

	      var source = models.source,
	          target = models.target;

	      // this.log(name, 'actions', source, target)

	      this.doAct(source, name);
	      this.doAct(target, name);

	      this.emitAction(name, action);

	      cUndo.push(action);
	      // this.log('actions undo', cUndo)
	    }
	  }, {
	    key: 'emitAction',
	    value: function emitAction(name, action) {
	      var fun = this.observer[name];
	      if (typeof fun === 'function') fun(action);
	    }
	  }, {
	    key: 'onUndo',
	    value: function onUndo(fun) {
	      this.observer.undo = fun;
	    }
	  }, {
	    key: 'onRedo',
	    value: function onRedo(fun) {
	      this.observer.redo = fun;
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.do({
	        name: 'undo',
	        container: {
	          do: this.actions.done,
	          undo: this.actions.undone
	        }
	      });
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.do({
	        name: 'redo',
	        container: {
	          do: this.actions.undone,
	          undo: this.actions.done
	        }
	      });
	    }
	  }, {
	    key: 'act',
	    value: function act(_ref2) {
	      var name = _ref2.name,
	          models = _ref2.models,
	          indexes = _ref2.indexes,
	          elements = _ref2.elements;

	      this.actions.done.push({
	        models: models,
	        indexes: indexes,
	        elements: elements
	      });
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ActionManager';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging;
	    }
	  }]);
	  return ActionManager;
	}();

	var GroupOps = {
	  // only insertAt operation needed to switch
	  // group of item moved
	  removeAt: function removeAt(_ref) {
	    var indexes = _ref.indexes,
	        containers = _ref.containers;
	  },
	  insertGroupOf: function insertGroupOf(targetContainer) {
	    return targetContainer.id;
	  },
	  setGroup: function setGroup(dropModel, group) {
	    dropModel[this.groupProp] = group;
	  },
	  insertAt: function insertAt(_ref2) {
	    var indexes = _ref2.indexes,
	        models = _ref2.models,
	        containers = _ref2.containers;

	    var index = indexes.drop;
	    var dropModel = models.transit;

	    this.log('insertAt', {
	      model: this.model,
	      index: index,
	      dropModel: dropModel
	    });
	    // create new model with new inserted
	    var before = this.model.slice(0, index);
	    var inclAfter = this.model.slice(index);

	    var group = this.insertGroupOf(containers.target);
	    this.setGroup(dropModel, group);

	    var newModel = this.createModel().concat(before, dropModel, inclAfter);

	    this.actionUpdateModel(newModel);
	    return newModel;
	  }
	};

	var createTimeMachine = defaults$1.createTimeMachine;


	var ImmutableModelManager = function (_ModelManager) {
	  inherits(ImmutableModelManager, _ModelManager);

	  function ImmutableModelManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ImmutableModelManager);

	    var _this = possibleConstructorReturn(this, (ImmutableModelManager.__proto__ || Object.getPrototypeOf(ImmutableModelManager)).call(this, opts));

	    _this.timeOut = opts.timeOut || 800;
	    var createTimeMachineFac = opts.createTimeMachine || createTimeMachine;
	    _this.timeMachine = createTimeMachineFac(Object.assign(opts, {
	      model: _this.model,
	      modelRef: _this.modelRef
	    }));
	    return _this;
	  }

	  createClass(ImmutableModelManager, [{
	    key: 'timeTravel',
	    value: function timeTravel(index) {
	      return this.timeMachine.timeTravel(index);
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      // this.log('UNDO', this.timeMachine)
	      this.timeMachine.undo();
	      return this;
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      // this.log('REDO', this.timeMachine)
	      this.timeMachine.redo();
	      return this;
	    }
	  }, {
	    key: 'addToHistory',
	    value: function addToHistory(model) {
	      this.timeMachine.addToHistory(model);
	      return this;
	    }

	    // override with Immutable

	  }, {
	    key: 'createModel',
	    value: function createModel(model) {
	      return model || [];
	    }

	    // TODO: add to history!?

	  }, {
	    key: 'createFor',
	    value: function createFor() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return new ImmutableModelManager(opts);
	    }
	  }, {
	    key: 'at',
	    value: function at(index) {
	      console.log('find model at', index, this.model);
	      return get(ImmutableModelManager.prototype.__proto__ || Object.getPrototypeOf(ImmutableModelManager.prototype), 'at', this).call(this, index);
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.model.length === 0;
	    }
	  }, {
	    key: 'actionUpdateModel',
	    value: function actionUpdateModel(newModel) {
	      var _this2 = this;

	      setTimeout(function () {
	        _this2.addToHistory(newModel);
	      }, this.timeOut || 800);
	    }
	  }, {
	    key: 'removeAt',
	    value: function removeAt(_ref) {
	      var indexes = _ref.indexes;

	      var index = indexes.drag;
	      this.log('removeAt', {
	        model: this.model,
	        index: index
	      });
	      // create new model with self excluded
	      var before = this.model.slice(0, index);
	      var exclAfter = this.model.slice(index + 1);

	      this.log('removeAt: concat', before, exclAfter);
	      var newModel = this.createModel().concat(before, exclAfter);

	      this.actionUpdateModel(newModel);
	      return newModel;
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(_ref2) {
	      var indexes = _ref2.indexes,
	          models = _ref2.models;

	      var index = indexes.drop;
	      var dropModel = models.transit;

	      this.log('insertAt', {
	        model: this.model,
	        index: index,
	        dropModel: dropModel
	      });
	      // create new model with new inserted
	      var before = this.model.slice(0, index);
	      var inclAfter = this.model.slice(index);
	      this.log('insertAt: concat', before, dropModel, inclAfter);

	      var newModel = this.createModel().concat(before, dropModel, inclAfter);

	      this.actionUpdateModel(newModel);
	      return newModel;
	    }
	  }, {
	    key: 'move',
	    value: function move(_ref3) {
	      var indexes = _ref3.indexes;

	      this.log('move', {
	        model: this.model,
	        indexes: indexes
	      });
	      this.timeMachine.undo();
	      return this;
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ImmutableModelManager';
	    }
	  }, {
	    key: 'model',
	    get: function get() {
	      return this.timeMachine ? this.timeMachine.model : this._model;
	    }
	  }, {
	    key: 'history',
	    get: function get() {
	      return this.timeMachine.history;
	    }
	  }, {
	    key: 'timeIndex',
	    get: function get() {
	      return this.timeMachine.timeIndex;
	    }
	  }, {
	    key: 'first',
	    get: function get() {
	      return this.at(0);
	    }
	  }, {
	    key: 'last',
	    get: function get() {
	      return this.at(this.model.length - 1);
	    }
	  }]);
	  return ImmutableModelManager;
	}(ModelManager);

	function plugin(Vue) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (plugin.installed) {
	    console.warn('[vue2-dragula] already installed.');
	  }

	  console.log('Add Dragula plugin:', options);
	  VueDragula(Vue, options);
	}

	plugin.version = '3.0.0';

	var Vue2Dragula = plugin;

	var defaults = {
	  service: defaults$2,
	  directive: dirDefaults,
	  commonDefaults: defaults$1
	};

	if (typeof define === 'function' && define.amd) {
	  // eslint-disable-line
	  define([], function () {
	    plugin;
	  }); // eslint-disable-line
	} else if (window.Vue) {
	  window.Vue.use(plugin);
	}

	exports.Vue2Dragula = Vue2Dragula;
	exports.defaults = defaults;
	exports.ActionManager = ActionManager;
	exports.VueDragula = VueDragula;
	exports.Dragula = Dragula;
	exports.Logger = Logger;
	exports.ServiceManager = ServiceManager;
	exports.Updater = Updater;
	exports.Base = Base;
	exports.Binder = Binder;
	exports.UnBinder = UnBinder;
	exports.Creator = Creator;
	exports.DragulaService = DragulaService;
	exports.DragHandler = DragHandler;
	exports.DragulaEventHandler = DragulaEventHandler;
	exports.ModelHandler = ModelHandler;
	exports.GroupOps = GroupOps;
	exports.ModelManager = ModelManager;
	exports.ImmutableModelManager = ImmutableModelManager;
	exports.TimeMachine = TimeMachine;

}));