(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular-split', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['angular-split'] = {}, global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, function (exports, core, common, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * @param {?} event
     * @return {?}
     */
    function getPointFromEvent(event) {
        // TouchEvent
        if (((/** @type {?} */ (event))).changedTouches !== undefined && ((/** @type {?} */ (event))).changedTouches.length > 0) {
            return {
                x: ((/** @type {?} */ (event))).changedTouches[0].clientX,
                y: ((/** @type {?} */ (event))).changedTouches[0].clientY,
            };
        }
        // MouseEvent
        else if (((/** @type {?} */ (event))).clientX !== undefined && ((/** @type {?} */ (event))).clientY !== undefined) {
            return {
                x: ((/** @type {?} */ (event))).clientX,
                y: ((/** @type {?} */ (event))).clientY,
            };
        }
        return null;
    }
    /**
     * @param {?} elRef
     * @param {?} direction
     * @return {?}
     */
    function getElementPixelSize(elRef, direction) {
        /** @type {?} */
        var rect = ((/** @type {?} */ (elRef.nativeElement))).getBoundingClientRect();
        return (direction === 'horizontal') ? rect.width : rect.height;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    function getInputBoolean(v) {
        return (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
    }
    /**
     * @template T
     * @param {?} v
     * @param {?} defaultValue
     * @return {?}
     */
    function getInputPositiveNumber(v, defaultValue) {
        if (v === null || v === undefined)
            return defaultValue;
        v = Number(v);
        return !isNaN(v) && v >= 0 ? v : defaultValue;
    }
    /**
     * @param {?} unit
     * @param {?} sizes
     * @return {?}
     */
    function isUserSizesValid(unit, sizes) {
        // All sizes have to be not null and total should be 100
        if (unit === 'percent') {
            /** @type {?} */
            var total = sizes.reduce((/**
             * @param {?} total
             * @param {?} s
             * @return {?}
             */
            function (total, s) { return s !== null ? total + s : total; }), 0);
            return sizes.every((/**
             * @param {?} s
             * @return {?}
             */
            function (s) { return s !== null; })) && total > 99.9 && total < 100.1;
        }
        // A size at null is mandatory but only one.
        if (unit === 'pixel') {
            return sizes.filter((/**
             * @param {?} s
             * @return {?}
             */
            function (s) { return s === null; })).length === 1;
        }
    }
    /**
     * @param {?} a
     * @return {?}
     */
    function getAreaMinSize(a) {
        if (a.size === null) {
            return null;
        }
        if (a.component.lockSize === true) {
            return a.size;
        }
        if (a.component.minSize === null) {
            return null;
        }
        if (a.component.minSize > a.size) {
            return a.size;
        }
        return a.component.minSize;
    }
    /**
     * @param {?} a
     * @return {?}
     */
    function getAreaMaxSize(a) {
        if (a.size === null) {
            return null;
        }
        if (a.component.lockSize === true) {
            return a.size;
        }
        if (a.component.maxSize === null) {
            return null;
        }
        if (a.component.maxSize < a.size) {
            return a.size;
        }
        return a.component.maxSize;
    }
    /**
     * @param {?} unit
     * @param {?} sideAreas
     * @param {?} pixels
     * @param {?} allAreasSizePixel
     * @return {?}
     */
    function getGutterSideAbsorptionCapacity(unit, sideAreas, pixels, allAreasSizePixel) {
        return sideAreas.reduce((/**
         * @param {?} acc
         * @param {?} area
         * @return {?}
         */
        function (acc, area) {
            /** @type {?} */
            var res = getAreaAbsorptionCapacity(unit, area, acc.remain, allAreasSizePixel);
            acc.list.push(res);
            acc.remain = res.pixelRemain;
            return acc;
        }), { remain: pixels, list: [] });
    }
    /**
     * @param {?} unit
     * @param {?} areaSnapshot
     * @param {?} pixels
     * @param {?} allAreasSizePixel
     * @return {?}
     */
    function getAreaAbsorptionCapacity(unit, areaSnapshot, pixels, allAreasSizePixel) {
        // No pain no gain
        if (pixels === 0) {
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: 0,
                percentAfterAbsorption: areaSnapshot.sizePercentAtStart,
                pixelRemain: 0,
            };
        }
        // Area start at zero and need to be reduced, not possible
        if (areaSnapshot.sizePixelAtStart === 0 && pixels < 0) {
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: 0,
                percentAfterAbsorption: 0,
                pixelRemain: pixels,
            };
        }
        if (unit === 'percent') {
            return getAreaAbsorptionCapacityPercent(areaSnapshot, pixels, allAreasSizePixel);
        }
        if (unit === 'pixel') {
            return getAreaAbsorptionCapacityPixel(areaSnapshot, pixels);
        }
    }
    /**
     * @param {?} areaSnapshot
     * @param {?} pixels
     * @param {?} allAreasSizePixel
     * @return {?}
     */
    function getAreaAbsorptionCapacityPercent(areaSnapshot, pixels, allAreasSizePixel) {
        /** @type {?} */
        var tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
        /** @type {?} */
        var tempPercentSize = tempPixelSize / allAreasSizePixel * 100;
        // ENLARGE AREA
        if (pixels > 0) {
            // If maxSize & newSize bigger than it > absorb to max and return remaining pixels 
            if (areaSnapshot.area.maxSize !== null && tempPercentSize > areaSnapshot.area.maxSize) {
                // Use area.area.maxSize as newPercentSize and return calculate pixels remaining
                /** @type {?} */
                var maxSizePixel = areaSnapshot.area.maxSize / 100 * allAreasSizePixel;
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: maxSizePixel,
                    percentAfterAbsorption: areaSnapshot.area.maxSize,
                    pixelRemain: areaSnapshot.sizePixelAtStart + pixels - maxSizePixel
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: tempPercentSize > 100 ? 100 : tempPercentSize,
                pixelRemain: 0
            };
        }
        // REDUCE AREA
        else if (pixels < 0) {
            // If minSize & newSize smaller than it > absorb to min and return remaining pixels 
            if (areaSnapshot.area.minSize !== null && tempPercentSize < areaSnapshot.area.minSize) {
                // Use area.area.minSize as newPercentSize and return calculate pixels remaining
                /** @type {?} */
                var minSizePixel = areaSnapshot.area.minSize / 100 * allAreasSizePixel;
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: minSizePixel,
                    percentAfterAbsorption: areaSnapshot.area.minSize,
                    pixelRemain: areaSnapshot.sizePixelAtStart + pixels - minSizePixel
                };
            }
            // If reduced under zero > return remaining pixels
            else if (tempPercentSize < 0) {
                // Use 0 as newPercentSize and return calculate pixels remaining
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: 0,
                    pixelRemain: pixels + areaSnapshot.sizePixelAtStart
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: tempPercentSize,
                pixelRemain: 0
            };
        }
    }
    /**
     * @param {?} areaSnapshot
     * @param {?} pixels
     * @param {?} containerSizePixel
     * @return {?}
     */
    function getAreaAbsorptionCapacityPixel(areaSnapshot, pixels, containerSizePixel) {
        /** @type {?} */
        var tempPixelSize = areaSnapshot.sizePixelAtStart + pixels;
        // ENLARGE AREA
        if (pixels > 0) {
            // If maxSize & newSize bigger than it > absorb to max and return remaining pixels 
            if (areaSnapshot.area.maxSize !== null && tempPixelSize > areaSnapshot.area.maxSize) {
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: areaSnapshot.area.maxSize - areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: -1,
                    pixelRemain: tempPixelSize - areaSnapshot.area.maxSize
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: -1,
                pixelRemain: 0
            };
        }
        // REDUCE AREA
        else if (pixels < 0) {
            // If minSize & newSize smaller than it > absorb to min and return remaining pixels 
            if (areaSnapshot.area.minSize !== null && tempPixelSize < areaSnapshot.area.minSize) {
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: areaSnapshot.area.minSize + pixels - tempPixelSize,
                    percentAfterAbsorption: -1,
                    pixelRemain: tempPixelSize - areaSnapshot.area.minSize
                };
            }
            // If reduced under zero > return remaining pixels
            else if (tempPixelSize < 0) {
                return {
                    areaSnapshot: areaSnapshot,
                    pixelAbsorb: -areaSnapshot.sizePixelAtStart,
                    percentAfterAbsorption: -1,
                    pixelRemain: pixels + areaSnapshot.sizePixelAtStart
                };
            }
            return {
                areaSnapshot: areaSnapshot,
                pixelAbsorb: pixels,
                percentAfterAbsorption: -1,
                pixelRemain: 0
            };
        }
    }
    /**
     * @param {?} unit
     * @param {?} item
     * @return {?}
     */
    function updateAreaSize(unit, item) {
        if (unit === 'percent') {
            item.areaSnapshot.area.size = item.percentAfterAbsorption;
        }
        else if (unit === 'pixel') {
            // Update size except for the wildcard size area
            if (item.areaSnapshot.area.size !== null) {
                item.areaSnapshot.area.size = item.areaSnapshot.sizePixelAtStart + item.pixelAbsorb;
            }
        }
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * angular-split
     *
     *
     *  PERCENT MODE ([unit]="'percent'")
     *  ___________________________________________________________________________________________
     * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
     * |-------------------------------------------------------------------------------------------|
     * |       20                 30                 20                 15                 15      | <-- [size]="x"
     * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
     * |calc(20% - 8px)    calc(30% - 12px)   calc(20% - 8px)    calc(15% - 6px)    calc(15% - 6px)| <-- CSS flex-basis property (with flex-grow&shrink at 0)
     * |     152px              228px              152px              114px              114px     | <-- el.getBoundingClientRect().width
     * |___________________________________________________________________________________________|
     *                                                                                 800px         <-- el.getBoundingClientRect().width
     *  flex-basis = calc( { area.size }% - { area.size/100 * nbGutter*gutterSize }px );
     *
     *
     *  PIXEL MODE ([unit]="'pixel'")
     *  ___________________________________________________________________________________________
     * |       A       [g1]       B       [g2]       C       [g3]       D       [g4]       E       |
     * |-------------------------------------------------------------------------------------------|
     * |      100                250                 *                 150                100      | <-- [size]="y"
     * |               10px               10px               10px               10px               | <-- [gutterSize]="10"
     * |   0 0 100px          0 0 250px           1 1 auto          0 0 150px          0 0 100px   | <-- CSS flex property (flex-grow/flex-shrink/flex-basis)
     * |     100px              250px              200px              150px              100px     | <-- el.getBoundingClientRect().width
     * |___________________________________________________________________________________________|
     *                                                                                 800px         <-- el.getBoundingClientRect().width
     *
     */
    var SplitComponent = /** @class */ (function () {
        function SplitComponent(ngZone, elRef, cdRef, renderer) {
            this.ngZone = ngZone;
            this.elRef = elRef;
            this.cdRef = cdRef;
            this.renderer = renderer;
            this._direction = 'horizontal';
            ////
            this._unit = 'percent';
            ////
            this._gutterSize = 11;
            ////
            this._gutterStep = 1;
            ////
            this._restrictMove = false;
            ////
            this._useTransition = false;
            ////
            this._disabled = false;
            ////
            this._dir = 'ltr';
            ////
            this._gutterDblClickDuration = 0;
            ////
            this.dragStart = new core.EventEmitter(false);
            this.dragEnd = new core.EventEmitter(false);
            this.gutterClick = new core.EventEmitter(false);
            this.gutterDblClick = new core.EventEmitter(false);
            this.dragProgressSubject = new rxjs.Subject();
            this.dragProgress$ = this.dragProgressSubject.asObservable();
            ////
            this.isDragging = false;
            this.isWaitingClear = false;
            this.dragListeners = [];
            this.snapshot = null;
            this.startPoint = null;
            this.endPoint = null;
            this.displayedAreas = [];
            this.hidedAreas = [];
            this._clickTimeout = null;
            // To force adding default class, could be override by user @Input() or not
            this.direction = this._direction;
        }
        Object.defineProperty(SplitComponent.prototype, "direction", {
            get: /**
             * @return {?}
             */
            function () {
                return this._direction;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._direction = (v === 'vertical') ? 'vertical' : 'horizontal';
                this.renderer.addClass(this.elRef.nativeElement, "as-" + this._direction);
                this.renderer.removeClass(this.elRef.nativeElement, "as-" + ((this._direction === 'vertical') ? 'horizontal' : 'vertical'));
                this.build(false, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "unit", {
            get: /**
             * @return {?}
             */
            function () {
                return this._unit;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._unit = (v === 'pixel') ? 'pixel' : 'percent';
                this.renderer.addClass(this.elRef.nativeElement, "as-" + this._unit);
                this.renderer.removeClass(this.elRef.nativeElement, "as-" + ((this._unit === 'pixel') ? 'percent' : 'pixel'));
                this.build(false, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "gutterSize", {
            get: /**
             * @return {?}
             */
            function () {
                return this._gutterSize;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._gutterSize = getInputPositiveNumber(v, 11);
                this.build(false, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "gutterStep", {
            get: /**
             * @return {?}
             */
            function () {
                return this._gutterStep;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._gutterStep = getInputPositiveNumber(v, 1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "restrictMove", {
            get: /**
             * @return {?}
             */
            function () {
                return this._restrictMove;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._restrictMove = getInputBoolean(v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "useTransition", {
            get: /**
             * @return {?}
             */
            function () {
                return this._useTransition;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._useTransition = getInputBoolean(v);
                if (this._useTransition)
                    this.renderer.addClass(this.elRef.nativeElement, 'as-transition');
                else
                    this.renderer.removeClass(this.elRef.nativeElement, 'as-transition');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "disabled", {
            get: /**
             * @return {?}
             */
            function () {
                return this._disabled;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._disabled = getInputBoolean(v);
                if (this._disabled)
                    this.renderer.addClass(this.elRef.nativeElement, 'as-disabled');
                else
                    this.renderer.removeClass(this.elRef.nativeElement, 'as-disabled');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "dir", {
            get: /**
             * @return {?}
             */
            function () {
                return this._dir;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._dir = (v === 'rtl') ? 'rtl' : 'ltr';
                this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "gutterDblClickDuration", {
            get: /**
             * @return {?}
             */
            function () {
                return this._gutterDblClickDuration;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitComponent.prototype, "transitionEnd", {
            get: /**
             * @return {?}
             */
            function () {
                var _this = this;
                return new rxjs.Observable((/**
                 * @param {?} subscriber
                 * @return {?}
                 */
                function (subscriber) { return _this.transitionEndSubscriber = subscriber; })).pipe(operators.debounceTime(20));
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        SplitComponent.prototype.ngAfterViewInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                // To avoid transition at first rendering
                setTimeout((/**
                 * @return {?}
                 */
                function () { return _this.renderer.addClass(_this.elRef.nativeElement, 'as-init'); }));
            }));
        };
        /**
         * @private
         * @return {?}
         */
        SplitComponent.prototype.getNbGutters = /**
         * @private
         * @return {?}
         */
        function () {
            return (this.displayedAreas.length === 0) ? 0 : this.displayedAreas.length - 1;
        };
        /**
         * @param {?} component
         * @return {?}
         */
        SplitComponent.prototype.addArea = /**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            /** @type {?} */
            var newArea = {
                component: component,
                order: 0,
                size: 0,
                minSize: null,
                maxSize: null,
            };
            if (component.visible === true) {
                this.displayedAreas.push(newArea);
                this.build(true, true);
            }
            else {
                this.hidedAreas.push(newArea);
            }
        };
        /**
         * @param {?} component
         * @return {?}
         */
        SplitComponent.prototype.removeArea = /**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            if (this.displayedAreas.some((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.component === component; }))) {
                /** @type {?} */
                var area = this.displayedAreas.find((/**
                 * @param {?} a
                 * @return {?}
                 */
                function (a) { return a.component === component; }));
                this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
                this.build(true, true);
            }
            else if (this.hidedAreas.some((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.component === component; }))) {
                /** @type {?} */
                var area = this.hidedAreas.find((/**
                 * @param {?} a
                 * @return {?}
                 */
                function (a) { return a.component === component; }));
                this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            }
        };
        /**
         * @param {?} component
         * @param {?} resetOrders
         * @param {?} resetSizes
         * @return {?}
         */
        SplitComponent.prototype.updateArea = /**
         * @param {?} component
         * @param {?} resetOrders
         * @param {?} resetSizes
         * @return {?}
         */
        function (component, resetOrders, resetSizes) {
            if (component.visible === true) {
                this.build(resetOrders, resetSizes);
            }
        };
        /**
         * @param {?} component
         * @return {?}
         */
        SplitComponent.prototype.showArea = /**
         * @param {?} component
         * @return {?}
         */
        function (component) {
            var _a;
            /** @type {?} */
            var area = this.hidedAreas.find((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.component === component; }));
            if (area === undefined) {
                return;
            }
            /** @type {?} */
            var areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
            (_a = this.displayedAreas).push.apply(_a, __spread(areas));
            this.build(true, true);
        };
        /**
         * @param {?} comp
         * @return {?}
         */
        SplitComponent.prototype.hideArea = /**
         * @param {?} comp
         * @return {?}
         */
        function (comp) {
            var _a;
            /** @type {?} */
            var area = this.displayedAreas.find((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.component === comp; }));
            if (area === undefined) {
                return;
            }
            /** @type {?} */
            var areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            areas.forEach((/**
             * @param {?} area
             * @return {?}
             */
            function (area) {
                area.order = 0;
                area.size = 0;
            }));
            (_a = this.hidedAreas).push.apply(_a, __spread(areas));
            this.build(true, true);
        };
        /**
         * @return {?}
         */
        SplitComponent.prototype.getVisibleAreaSizes = /**
         * @return {?}
         */
        function () {
            return this.displayedAreas.map((/**
             * @param {?} a
             * @return {?}
             */
            function (a) { return a.size === null ? '*' : a.size; }));
        };
        /**
         * @param {?} sizes
         * @return {?}
         */
        SplitComponent.prototype.setVisibleAreaSizes = /**
         * @param {?} sizes
         * @return {?}
         */
        function (sizes) {
            if (sizes.length !== this.displayedAreas.length) {
                return false;
            }
            /** @type {?} */
            var formatedSizes = sizes.map((/**
             * @param {?} s
             * @return {?}
             */
            function (s) { return getInputPositiveNumber(s, null); }));
            /** @type {?} */
            var isValid = isUserSizesValid(this.unit, formatedSizes);
            if (isValid === false) {
                return false;
            }
            // @ts-ignore
            this.displayedAreas.forEach((/**
             * @param {?} area
             * @param {?} i
             * @return {?}
             */
            function (area, i) { return area.component._size = formatedSizes[i]; }));
            this.build(false, true);
            return true;
        };
        /**
         * @private
         * @param {?} resetOrders
         * @param {?} resetSizes
         * @return {?}
         */
        SplitComponent.prototype.build = /**
         * @private
         * @param {?} resetOrders
         * @param {?} resetSizes
         * @return {?}
         */
        function (resetOrders, resetSizes) {
            this.stopDragging();
            // ¤ AREAS ORDER
            if (resetOrders === true) {
                // If user provided 'order' for each area, use it to sort them.
                if (this.displayedAreas.every((/**
                 * @param {?} a
                 * @return {?}
                 */
                function (a) { return a.component.order !== null; }))) {
                    this.displayedAreas.sort((/**
                     * @param {?} a
                     * @param {?} b
                     * @return {?}
                     */
                    function (a, b) { return ((/** @type {?} */ (a.component.order))) - ((/** @type {?} */ (b.component.order))); }));
                }
                // Then set real order with multiples of 2, numbers between will be used by gutters.
                this.displayedAreas.forEach((/**
                 * @param {?} area
                 * @param {?} i
                 * @return {?}
                 */
                function (area, i) {
                    area.order = i * 2;
                    area.component.setStyleOrder(area.order);
                }));
            }
            // ¤ AREAS SIZE
            if (resetSizes === true) {
                /** @type {?} */
                var useUserSizes_1 = isUserSizesValid(this.unit, this.displayedAreas.map((/**
                 * @param {?} a
                 * @return {?}
                 */
                function (a) { return a.component.size; })));
                switch (this.unit) {
                    case 'percent': {
                        /** @type {?} */
                        var defaultSize_1 = 100 / this.displayedAreas.length;
                        this.displayedAreas.forEach((/**
                         * @param {?} area
                         * @return {?}
                         */
                        function (area) {
                            area.size = useUserSizes_1 ? (/** @type {?} */ (area.component.size)) : defaultSize_1;
                            area.minSize = getAreaMinSize(area);
                            area.maxSize = getAreaMaxSize(area);
                        }));
                        break;
                    }
                    case 'pixel': {
                        if (useUserSizes_1) {
                            this.displayedAreas.forEach((/**
                             * @param {?} area
                             * @return {?}
                             */
                            function (area) {
                                area.size = area.component.size;
                                area.minSize = getAreaMinSize(area);
                                area.maxSize = getAreaMaxSize(area);
                            }));
                        }
                        else {
                            /** @type {?} */
                            var wildcardSizeAreas = this.displayedAreas.filter((/**
                             * @param {?} a
                             * @return {?}
                             */
                            function (a) { return a.component.size === null; }));
                            // No wildcard area > Need to select one arbitrarily > first
                            if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
                                this.displayedAreas.forEach((/**
                                 * @param {?} area
                                 * @param {?} i
                                 * @return {?}
                                 */
                                function (area, i) {
                                    area.size = (i === 0) ? null : area.component.size;
                                    area.minSize = (i === 0) ? null : getAreaMinSize(area);
                                    area.maxSize = (i === 0) ? null : getAreaMaxSize(area);
                                }));
                            }
                            // More than one wildcard area > Need to keep only one arbitrarly > first
                            else if (wildcardSizeAreas.length > 1) {
                                /** @type {?} */
                                var alreadyGotOne_1 = false;
                                this.displayedAreas.forEach((/**
                                 * @param {?} area
                                 * @return {?}
                                 */
                                function (area) {
                                    if (area.component.size === null) {
                                        if (alreadyGotOne_1 === false) {
                                            area.size = null;
                                            area.minSize = null;
                                            area.maxSize = null;
                                            alreadyGotOne_1 = true;
                                        }
                                        else {
                                            area.size = 100;
                                            area.minSize = null;
                                            area.maxSize = null;
                                        }
                                    }
                                    else {
                                        area.size = area.component.size;
                                        area.minSize = getAreaMinSize(area);
                                        area.maxSize = getAreaMaxSize(area);
                                    }
                                }));
                            }
                        }
                        break;
                    }
                }
            }
            this.refreshStyleSizes();
            this.cdRef.markForCheck();
        };
        /**
         * @private
         * @return {?}
         */
        SplitComponent.prototype.refreshStyleSizes = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            ///////////////////////////////////////////
            // PERCENT MODE
            if (this.unit === 'percent') {
                // Only one area > flex-basis 100%
                if (this.displayedAreas.length === 1) {
                    this.displayedAreas[0].component.setStyleFlex(0, 0, "100%", false, false);
                }
                // Multiple areas > use each percent basis
                else {
                    /** @type {?} */
                    var sumGutterSize_1 = this.getNbGutters() * this.gutterSize;
                    this.displayedAreas.forEach((/**
                     * @param {?} area
                     * @return {?}
                     */
                    function (area) {
                        area.component.setStyleFlex(0, 0, "calc( " + area.size + "% - " + (/** @type {?} */ (area.size)) / 100 * sumGutterSize_1 + "px )", (area.minSize !== null && area.minSize === area.size) ? true : false, (area.maxSize !== null && area.maxSize === area.size) ? true : false);
                    }));
                }
            }
            ///////////////////////////////////////////
            // PIXEL MODE
            else if (this.unit === 'pixel') {
                this.displayedAreas.forEach((/**
                 * @param {?} area
                 * @return {?}
                 */
                function (area) {
                    // Area with wildcard size
                    if (area.size === null) {
                        if (_this.displayedAreas.length === 1) {
                            area.component.setStyleFlex(1, 1, "100%", false, false);
                        }
                        else {
                            area.component.setStyleFlex(1, 1, "auto", false, false);
                        }
                    }
                    // Area with pixel size
                    else {
                        // Only one area > flex-basis 100%
                        if (_this.displayedAreas.length === 1) {
                            area.component.setStyleFlex(0, 0, "100%", false, false);
                        }
                        // Multiple areas > use each pixel basis
                        else {
                            area.component.setStyleFlex(0, 0, area.size + "px", (area.minSize !== null && area.minSize === area.size) ? true : false, (area.maxSize !== null && area.maxSize === area.size) ? true : false);
                        }
                    }
                }));
            }
        };
        /**
         * @param {?} event
         * @param {?} gutterNum
         * @return {?}
         */
        SplitComponent.prototype.clickGutter = /**
         * @param {?} event
         * @param {?} gutterNum
         * @return {?}
         */
        function (event, gutterNum) {
            var _this = this;
            /** @type {?} */
            var tempPoint = getPointFromEvent(event);
            // Be sure mouseup/touchend happened at same point as mousedown/touchstart to trigger click/dblclick
            if (this.startPoint && this.startPoint.x === tempPoint.x && this.startPoint.y === tempPoint.y) {
                // If timeout in progress and new click > clearTimeout & dblClickEvent
                if (this._clickTimeout !== null) {
                    window.clearTimeout(this._clickTimeout);
                    this._clickTimeout = null;
                    this.notify('dblclick', gutterNum);
                    this.stopDragging();
                }
                // Else start timeout to call clickEvent at end
                else {
                    this._clickTimeout = window.setTimeout((/**
                     * @return {?}
                     */
                    function () {
                        _this._clickTimeout = null;
                        _this.notify('click', gutterNum);
                        _this.stopDragging();
                    }), this.gutterDblClickDuration);
                }
            }
        };
        /**
         * @param {?} event
         * @param {?} gutterOrder
         * @param {?} gutterNum
         * @return {?}
         */
        SplitComponent.prototype.startDragging = /**
         * @param {?} event
         * @param {?} gutterOrder
         * @param {?} gutterNum
         * @return {?}
         */
        function (event, gutterOrder, gutterNum) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            this.startPoint = getPointFromEvent(event);
            if (this.startPoint === null || this.disabled === true || this.isWaitingClear === true) {
                return;
            }
            this.snapshot = {
                gutterNum: gutterNum,
                lastSteppedOffset: 0,
                allAreasSizePixel: getElementPixelSize(this.elRef, this.direction) - this.getNbGutters() * this.gutterSize,
                allInvolvedAreasSizePercent: 100,
                areasBeforeGutter: [],
                areasAfterGutter: [],
            };
            this.displayedAreas.forEach((/**
             * @param {?} area
             * @return {?}
             */
            function (area) {
                /** @type {?} */
                var areaSnapshot = {
                    area: area,
                    sizePixelAtStart: getElementPixelSize(area.component.elRef, _this.direction),
                    sizePercentAtStart: (_this.unit === 'percent') ? area.size : -1 // If pixel mode, anyway, will not be used.
                };
                if (area.order < gutterOrder) {
                    if (_this.restrictMove === true) {
                        _this.snapshot.areasBeforeGutter = [areaSnapshot];
                    }
                    else {
                        _this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
                    }
                }
                else if (area.order > gutterOrder) {
                    if (_this.restrictMove === true) {
                        if (_this.snapshot.areasAfterGutter.length === 0)
                            _this.snapshot.areasAfterGutter = [areaSnapshot];
                    }
                    else {
                        _this.snapshot.areasAfterGutter.push(areaSnapshot);
                    }
                }
            }));
            this.snapshot.allInvolvedAreasSizePercent = __spread(this.snapshot.areasBeforeGutter, this.snapshot.areasAfterGutter).reduce((/**
             * @param {?} t
             * @param {?} a
             * @return {?}
             */
            function (t, a) { return t + a.sizePercentAtStart; }), 0);
            if (this.snapshot.areasBeforeGutter.length === 0 || this.snapshot.areasAfterGutter.length === 0) {
                return;
            }
            this.dragListeners.push(this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchend', this.stopDragging.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this)));
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                _this.dragListeners.push(_this.renderer.listen('document', 'mousemove', _this.dragEvent.bind(_this)));
                _this.dragListeners.push(_this.renderer.listen('document', 'touchmove', _this.dragEvent.bind(_this)));
            }));
            this.displayedAreas.forEach((/**
             * @param {?} area
             * @return {?}
             */
            function (area) { return area.component.lockEvents(); }));
            this.isDragging = true;
            this.renderer.addClass(this.elRef.nativeElement, 'as-dragging');
            this.renderer.addClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'as-dragged');
            this.notify('start', this.snapshot.gutterNum);
        };
        /**
         * @private
         * @param {?} event
         * @return {?}
         */
        SplitComponent.prototype.dragEvent = /**
         * @private
         * @param {?} event
         * @return {?}
         */
        function (event) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            if (this._clickTimeout !== null) {
                window.clearTimeout(this._clickTimeout);
                this._clickTimeout = null;
            }
            if (this.isDragging === false) {
                return;
            }
            this.endPoint = getPointFromEvent(event);
            if (this.endPoint === null) {
                return;
            }
            // Calculate steppedOffset
            /** @type {?} */
            var offset = (this.direction === 'horizontal') ? (this.startPoint.x - this.endPoint.x) : (this.startPoint.y - this.endPoint.y);
            if (this.dir === 'rtl') {
                offset = -offset;
            }
            /** @type {?} */
            var steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
            if (steppedOffset === this.snapshot.lastSteppedOffset) {
                return;
            }
            this.snapshot.lastSteppedOffset = steppedOffset;
            // Need to know if each gutter side areas could reacts to steppedOffset
            /** @type {?} */
            var areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -steppedOffset, this.snapshot.allAreasSizePixel);
            /** @type {?} */
            var areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset, this.snapshot.allAreasSizePixel);
            // Each gutter side areas can't absorb all offset 
            if (areasBefore.remain !== 0 && areasAfter.remain !== 0) {
                if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) ;
                else if (Math.abs(areasBefore.remain) > Math.abs(areasAfter.remain)) {
                    areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
                }
                else {
                    areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
                }
            }
            // Areas before gutter can't absorbs all offset > need to recalculate sizes for areas after gutter.
            else if (areasBefore.remain !== 0) {
                areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset + areasBefore.remain, this.snapshot.allAreasSizePixel);
            }
            // Areas after gutter can't absorbs all offset > need to recalculate sizes for areas before gutter.
            else if (areasAfter.remain !== 0) {
                areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -(steppedOffset - areasAfter.remain), this.snapshot.allAreasSizePixel);
            }
            if (this.unit === 'percent') {
                // Hack because of browser messing up with sizes using calc(X% - Ypx) -> el.getBoundingClientRect()
                // If not there, playing with gutters makes total going down to 99.99875% then 99.99286%, 99.98986%,..
                /** @type {?} */
                var all = __spread(areasBefore.list, areasAfter.list);
                /** @type {?} */
                var areaToReset_1 = all.find((/**
                 * @param {?} a
                 * @return {?}
                 */
                function (a) { return a.percentAfterAbsorption !== 0 && a.percentAfterAbsorption !== a.areaSnapshot.area.minSize && a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize; }));
                if (areaToReset_1) {
                    areaToReset_1.percentAfterAbsorption = this.snapshot.allInvolvedAreasSizePercent - all.filter((/**
                     * @param {?} a
                     * @return {?}
                     */
                    function (a) { return a !== areaToReset_1; })).reduce((/**
                     * @param {?} total
                     * @param {?} a
                     * @return {?}
                     */
                    function (total, a) { return total + a.percentAfterAbsorption; }), 0);
                }
            }
            // Now we know areas could absorb steppedOffset, time to really update sizes
            areasBefore.list.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return updateAreaSize(_this.unit, item); }));
            areasAfter.list.forEach((/**
             * @param {?} item
             * @return {?}
             */
            function (item) { return updateAreaSize(_this.unit, item); }));
            this.refreshStyleSizes();
            this.notify('progress', this.snapshot.gutterNum);
        };
        /**
         * @private
         * @param {?=} event
         * @return {?}
         */
        SplitComponent.prototype.stopDragging = /**
         * @private
         * @param {?=} event
         * @return {?}
         */
        function (event) {
            var _this = this;
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (this.isDragging === false) {
                return;
            }
            this.displayedAreas.forEach((/**
             * @param {?} area
             * @return {?}
             */
            function (area) { return area.component.unlockEvents(); }));
            while (this.dragListeners.length > 0) {
                /** @type {?} */
                var fct = this.dragListeners.pop();
                if (fct)
                    fct();
            }
            // Warning: Have to be before "notify('end')" 
            // because "notify('end')"" can be linked to "[size]='x'" > "build()" > "stopDragging()"
            this.isDragging = false;
            // If moved from starting point, notify end
            if (this.endPoint && (this.startPoint.x !== this.endPoint.x || this.startPoint.y !== this.endPoint.y)) {
                this.notify('end', this.snapshot.gutterNum);
            }
            this.renderer.removeClass(this.elRef.nativeElement, 'as-dragging');
            this.renderer.removeClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'as-dragged');
            this.snapshot = null;
            this.isWaitingClear = true;
            // Needed to let (click)="clickGutter(...)" event run and verify if mouse moved or not
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                setTimeout((/**
                 * @return {?}
                 */
                function () {
                    _this.startPoint = null;
                    _this.endPoint = null;
                    _this.isWaitingClear = false;
                }));
            }));
        };
        /**
         * @param {?} type
         * @param {?} gutterNum
         * @return {?}
         */
        SplitComponent.prototype.notify = /**
         * @param {?} type
         * @param {?} gutterNum
         * @return {?}
         */
        function (type, gutterNum) {
            var _this = this;
            /** @type {?} */
            var sizes = this.getVisibleAreaSizes();
            if (type === 'start') {
                this.dragStart.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'end') {
                this.dragEnd.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'click') {
                this.gutterClick.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'dblclick') {
                this.gutterDblClick.emit({ gutterNum: gutterNum, sizes: sizes });
            }
            else if (type === 'transitionEnd') {
                if (this.transitionEndSubscriber) {
                    this.ngZone.run((/**
                     * @return {?}
                     */
                    function () { return _this.transitionEndSubscriber.next(sizes); }));
                }
            }
            else if (type === 'progress') {
                // Stay outside zone to allow users do what they want about change detection mechanism.
                this.dragProgressSubject.next({ gutterNum: gutterNum, sizes: sizes });
            }
        };
        /**
         * @return {?}
         */
        SplitComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            this.stopDragging();
        };
        SplitComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'as-split',
                        exportAs: 'asSplit',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        template: "\n        <ng-content></ng-content>\n        <ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\n            <div *ngIf=\"last === false\" \n                 #gutterEls\n                 class=\"as-split-gutter\"\n                 [style.flex-basis.px]=\"gutterSize\"\n                 [style.order]=\"index*2+1\"\n                 (mousedown)=\"startDragging($event, index*2+1, index+1)\"\n                 (touchstart)=\"startDragging($event, index*2+1, index+1)\"\n                 (mouseup)=\"clickGutter($event, index+1)\"\n                 (touchend)=\"clickGutter($event, index+1)\">\n                <div class=\"as-split-gutter-icon\"></div>\n            </div>\n        </ng-template>",
                        styles: [":host{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}:host>.as-split-gutter{flex-grow:0;flex-shrink:0;background-color:#eee;display:flex;align-items:center;justify-content:center}:host>.as-split-gutter>.as-split-gutter-icon{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}:host ::ng-deep>.as-split-area{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}:host ::ng-deep>.as-split-area.as-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}:host.as-horizontal{flex-direction:row}:host.as-horizontal>.as-split-gutter{flex-direction:row;cursor:col-resize;height:100%}:host.as-horizontal>.as-split-gutter>.as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==)}:host.as-horizontal ::ng-deep>.as-split-area{height:100%}:host.as-vertical{flex-direction:column}:host.as-vertical>.as-split-gutter{flex-direction:column;cursor:row-resize;width:100%}:host.as-vertical>.as-split-gutter .as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC)}:host.as-vertical ::ng-deep>.as-split-area{width:100%}:host.as-vertical ::ng-deep>.as-split-area.as-hidden{max-width:0}:host.as-disabled>.as-split-gutter{cursor:default}:host.as-disabled>.as-split-gutter .as-split-gutter-icon{background-image:url(\"\")}:host.as-transition.as-init:not(.as-dragging) ::ng-deep>.as-split-area,:host.as-transition.as-init:not(.as-dragging)>.as-split-gutter{transition:flex-basis .3s}"]
                    }] }
        ];
        /** @nocollapse */
        SplitComponent.ctorParameters = function () { return [
            { type: core.NgZone },
            { type: core.ElementRef },
            { type: core.ChangeDetectorRef },
            { type: core.Renderer2 }
        ]; };
        SplitComponent.propDecorators = {
            direction: [{ type: core.Input }],
            unit: [{ type: core.Input }],
            gutterSize: [{ type: core.Input }],
            gutterStep: [{ type: core.Input }],
            restrictMove: [{ type: core.Input }],
            useTransition: [{ type: core.Input }],
            disabled: [{ type: core.Input }],
            dir: [{ type: core.Input }],
            gutterDblClickDuration: [{ type: core.Input }],
            dragStart: [{ type: core.Output }],
            dragEnd: [{ type: core.Output }],
            gutterClick: [{ type: core.Output }],
            gutterDblClick: [{ type: core.Output }],
            transitionEnd: [{ type: core.Output }],
            gutterEls: [{ type: core.ViewChildren, args: ['gutterEls',] }]
        };
        return SplitComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var SplitAreaDirective = /** @class */ (function () {
        function SplitAreaDirective(ngZone, elRef, renderer, split) {
            this.ngZone = ngZone;
            this.elRef = elRef;
            this.renderer = renderer;
            this.split = split;
            this._order = null;
            ////
            this._size = null;
            ////
            this._minSize = null;
            ////
            this._maxSize = null;
            ////
            this._lockSize = false;
            ////
            this._visible = true;
            this.lockListeners = [];
            this.renderer.addClass(this.elRef.nativeElement, 'as-split-area');
        }
        Object.defineProperty(SplitAreaDirective.prototype, "order", {
            get: /**
             * @return {?}
             */
            function () {
                return this._order;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._order = getInputPositiveNumber(v, null);
                this.split.updateArea(this, true, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitAreaDirective.prototype, "size", {
            get: /**
             * @return {?}
             */
            function () {
                return this._size;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._size = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitAreaDirective.prototype, "minSize", {
            get: /**
             * @return {?}
             */
            function () {
                return this._minSize;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._minSize = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitAreaDirective.prototype, "maxSize", {
            get: /**
             * @return {?}
             */
            function () {
                return this._maxSize;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._maxSize = getInputPositiveNumber(v, null);
                this.split.updateArea(this, false, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitAreaDirective.prototype, "lockSize", {
            get: /**
             * @return {?}
             */
            function () {
                return this._lockSize;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._lockSize = getInputBoolean(v);
                this.split.updateArea(this, false, true);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SplitAreaDirective.prototype, "visible", {
            get: /**
             * @return {?}
             */
            function () {
                return this._visible;
            },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                this._visible = getInputBoolean(v);
                if (this._visible) {
                    this.split.showArea(this);
                    this.renderer.removeClass(this.elRef.nativeElement, 'as-hidden');
                }
                else {
                    this.split.hideArea(this);
                    this.renderer.addClass(this.elRef.nativeElement, 'as-hidden');
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        SplitAreaDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this.split.addArea(this);
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                _this.transitionListener = _this.renderer.listen(_this.elRef.nativeElement, 'transitionend', (/**
                 * @param {?} event
                 * @return {?}
                 */
                function (event) {
                    // Limit only flex-basis transition to trigger the event
                    if (event.propertyName === 'flex-basis') {
                        _this.split.notify('transitionEnd', -1);
                    }
                }));
            }));
        };
        /**
         * @param {?} value
         * @return {?}
         */
        SplitAreaDirective.prototype.setStyleOrder = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
        };
        /**
         * @param {?} grow
         * @param {?} shrink
         * @param {?} basis
         * @param {?} isMin
         * @param {?} isMax
         * @return {?}
         */
        SplitAreaDirective.prototype.setStyleFlex = /**
         * @param {?} grow
         * @param {?} shrink
         * @param {?} basis
         * @param {?} isMin
         * @param {?} isMax
         * @return {?}
         */
        function (grow, shrink, basis, isMin, isMax) {
            // Need 3 separated properties to work on IE11 (https://github.com/angular/flex-layout/issues/323)
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-grow', grow);
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-shrink', shrink);
            this.renderer.setStyle(this.elRef.nativeElement, 'flex-basis', basis);
            if (isMin === true)
                this.renderer.addClass(this.elRef.nativeElement, 'as-min');
            else
                this.renderer.removeClass(this.elRef.nativeElement, 'as-min');
            if (isMax === true)
                this.renderer.addClass(this.elRef.nativeElement, 'as-max');
            else
                this.renderer.removeClass(this.elRef.nativeElement, 'as-max');
        };
        /**
         * @return {?}
         */
        SplitAreaDirective.prototype.lockEvents = /**
         * @return {?}
         */
        function () {
            var _this = this;
            this.ngZone.runOutsideAngular((/**
             * @return {?}
             */
            function () {
                _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'selectstart', (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { return false; })));
                _this.lockListeners.push(_this.renderer.listen(_this.elRef.nativeElement, 'dragstart', (/**
                 * @param {?} e
                 * @return {?}
                 */
                function (e) { return false; })));
            }));
        };
        /**
         * @return {?}
         */
        SplitAreaDirective.prototype.unlockEvents = /**
         * @return {?}
         */
        function () {
            while (this.lockListeners.length > 0) {
                /** @type {?} */
                var fct = this.lockListeners.pop();
                if (fct)
                    fct();
            }
        };
        /**
         * @return {?}
         */
        SplitAreaDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            this.unlockEvents();
            if (this.transitionListener) {
                this.transitionListener();
            }
            this.split.removeArea(this);
        };
        SplitAreaDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: 'as-split-area, [as-split-area]',
                        exportAs: 'asSplitArea'
                    },] }
        ];
        /** @nocollapse */
        SplitAreaDirective.ctorParameters = function () { return [
            { type: core.NgZone },
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: SplitComponent }
        ]; };
        SplitAreaDirective.propDecorators = {
            order: [{ type: core.Input }],
            size: [{ type: core.Input }],
            minSize: [{ type: core.Input }],
            maxSize: [{ type: core.Input }],
            lockSize: [{ type: core.Input }],
            visible: [{ type: core.Input }]
        };
        return SplitAreaDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularSplitModule = /** @class */ (function () {
        function AngularSplitModule() {
        }
        /**
         * @return {?}
         */
        AngularSplitModule.forRoot = /**
         * @return {?}
         */
        function () {
            return {
                ngModule: AngularSplitModule,
                providers: []
            };
        };
        /**
         * @return {?}
         */
        AngularSplitModule.forChild = /**
         * @return {?}
         */
        function () {
            return {
                ngModule: AngularSplitModule,
                providers: []
            };
        };
        AngularSplitModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule
                        ],
                        declarations: [
                            SplitComponent,
                            SplitAreaDirective,
                        ],
                        exports: [
                            SplitComponent,
                            SplitAreaDirective,
                        ]
                    },] }
        ];
        return AngularSplitModule;
    }());

    exports.AngularSplitModule = AngularSplitModule;
    exports.SplitAreaDirective = SplitAreaDirective;
    exports.SplitComponent = SplitComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=angular-split.umd.js.map
