/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, ElementRef, NgZone, ViewChildren, QueryList, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getInputPositiveNumber, getInputBoolean, isUserSizesValid, getAreaMinSize, getAreaMaxSize, getPointFromEvent, getElementPixelSize, getGutterSideAbsorptionCapacity, updateAreaSize } from '../utils';
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
        this.dragStart = new EventEmitter(false);
        this.dragEnd = new EventEmitter(false);
        this.gutterClick = new EventEmitter(false);
        this.gutterDblClick = new EventEmitter(false);
        this.dragProgressSubject = new Subject();
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
            return new Observable((/**
             * @param {?} subscriber
             * @return {?}
             */
            function (subscriber) { return _this.transitionEndSubscriber = subscriber; })).pipe(debounceTime(20));
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
        (_a = this.displayedAreas).push.apply(_a, tslib_1.__spread(areas));
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
        (_a = this.hidedAreas).push.apply(_a, tslib_1.__spread(areas));
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
        this.snapshot.allInvolvedAreasSizePercent = tslib_1.__spread(this.snapshot.areasBeforeGutter, this.snapshot.areasAfterGutter).reduce((/**
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
            if (Math.abs(areasBefore.remain) === Math.abs(areasAfter.remain)) {
            }
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
            var all = tslib_1.__spread(areasBefore.list, areasAfter.list);
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
        { type: Component, args: [{
                    selector: 'as-split',
                    exportAs: 'asSplit',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: "\n        <ng-content></ng-content>\n        <ng-template ngFor [ngForOf]=\"displayedAreas\" let-index=\"index\" let-last=\"last\">\n            <div *ngIf=\"last === false\" \n                 #gutterEls\n                 class=\"as-split-gutter\"\n                 [style.flex-basis.px]=\"gutterSize\"\n                 [style.order]=\"index*2+1\"\n                 (mousedown)=\"startDragging($event, index*2+1, index+1)\"\n                 (touchstart)=\"startDragging($event, index*2+1, index+1)\"\n                 (mouseup)=\"clickGutter($event, index+1)\"\n                 (touchend)=\"clickGutter($event, index+1)\">\n                <div class=\"as-split-gutter-icon\"></div>\n            </div>\n        </ng-template>",
                    styles: [":host{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}:host>.as-split-gutter{flex-grow:0;flex-shrink:0;background-color:#eee;display:flex;align-items:center;justify-content:center}:host>.as-split-gutter>.as-split-gutter-icon{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}:host ::ng-deep>.as-split-area{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}:host ::ng-deep>.as-split-area.as-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}:host.as-horizontal{flex-direction:row}:host.as-horizontal>.as-split-gutter{flex-direction:row;cursor:col-resize;height:100%}:host.as-horizontal>.as-split-gutter>.as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==)}:host.as-horizontal ::ng-deep>.as-split-area{height:100%}:host.as-vertical{flex-direction:column}:host.as-vertical>.as-split-gutter{flex-direction:column;cursor:row-resize;width:100%}:host.as-vertical>.as-split-gutter .as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC)}:host.as-vertical ::ng-deep>.as-split-area{width:100%}:host.as-vertical ::ng-deep>.as-split-area.as-hidden{max-width:0}:host.as-disabled>.as-split-gutter{cursor:default}:host.as-disabled>.as-split-gutter .as-split-gutter-icon{background-image:url(\"\")}:host.as-transition.as-init:not(.as-dragging) ::ng-deep>.as-split-area,:host.as-transition.as-init:not(.as-dragging)>.as-split-gutter{transition:flex-basis .3s}"]
                }] }
    ];
    /** @nocollapse */
    SplitComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: Renderer2 }
    ]; };
    SplitComponent.propDecorators = {
        direction: [{ type: Input }],
        unit: [{ type: Input }],
        gutterSize: [{ type: Input }],
        gutterStep: [{ type: Input }],
        restrictMove: [{ type: Input }],
        useTransition: [{ type: Input }],
        disabled: [{ type: Input }],
        dir: [{ type: Input }],
        gutterDblClickDuration: [{ type: Input }],
        dragStart: [{ type: Output }],
        dragEnd: [{ type: Output }],
        gutterClick: [{ type: Output }],
        gutterDblClick: [{ type: Output }],
        transitionEnd: [{ type: Output }],
        gutterEls: [{ type: ViewChildren, args: ['gutterEls',] }]
    };
    return SplitComponent;
}());
export { SplitComponent };
if (false) {
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._direction;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._unit;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._gutterSize;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._gutterStep;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._restrictMove;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._useTransition;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._disabled;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._dir;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype._gutterDblClickDuration;
    /** @type {?} */
    SplitComponent.prototype.dragStart;
    /** @type {?} */
    SplitComponent.prototype.dragEnd;
    /** @type {?} */
    SplitComponent.prototype.gutterClick;
    /** @type {?} */
    SplitComponent.prototype.gutterDblClick;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.transitionEndSubscriber;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.dragProgressSubject;
    /** @type {?} */
    SplitComponent.prototype.dragProgress$;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.isDragging;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.isWaitingClear;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.dragListeners;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.snapshot;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.startPoint;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.endPoint;
    /** @type {?} */
    SplitComponent.prototype.displayedAreas;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.hidedAreas;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.gutterEls;
    /** @type {?} */
    SplitComponent.prototype._clickTimeout;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.ngZone;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.elRef;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.cdRef;
    /**
     * @type {?}
     * @private
     */
    SplitComponent.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1zcGxpdC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnQvc3BsaXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBNEIsVUFBVSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyTSxPQUFPLEVBQUUsVUFBVSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFJOUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLCtCQUErQixFQUFFLGNBQWMsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0M5TTtJQW9MSSx3QkFBb0IsTUFBYyxFQUNkLEtBQWlCLEVBQ2pCLEtBQXdCLEVBQ3hCLFFBQW1CO1FBSG5CLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2pCLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFoSy9CLGVBQVUsR0FBOEIsWUFBWSxDQUFDOztRQWlCckQsVUFBSyxHQUF3QixTQUFTLENBQUM7O1FBaUJ2QyxnQkFBVyxHQUFXLEVBQUUsQ0FBQzs7UUFjekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7O1FBWXhCLGtCQUFhLEdBQVksS0FBSyxDQUFDOztRQVkvQixtQkFBYyxHQUFZLEtBQUssQ0FBQzs7UUFlaEMsY0FBUyxHQUFZ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QTREOztJQUM1RCx3Q0FBK0Q7Ozs7O0lBRS9ELGlEQUE2RDs7Ozs7SUFPN0QsNkNBQWtFOztJQUNsRSx1Q0FBaUY7Ozs7O0lBSWpGLG9DQUFvQzs7Ozs7SUFDcEMsd0NBQXdDOzs7OztJQUN4Qyx1Q0FBNEM7Ozs7O0lBQzVDLGtDQUErQzs7Ozs7SUFDL0Msb0NBQXlDOzs7OztJQUN6QyxrQ0FBdUM7O0lBRXZDLHdDQUFrRDs7Ozs7SUFDbEQsb0NBQStDOzs7OztJQUUvQyxtQ0FBb0U7O0lBNlBwRSx1Q0FBbUM7Ozs7O0lBM1B2QixnQ0FBc0I7Ozs7O0lBQ3RCLCtCQUF5Qjs7Ozs7SUFDekIsK0JBQWdDOzs7OztJQUNoQyxrQ0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgUmVuZGVyZXIyLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIEVsZW1lbnRSZWYsIE5nWm9uZSwgVmlld0NoaWxkcmVuLCBRdWVyeUxpc3QsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7IElBcmVhLCBJUG9pbnQsIElTcGxpdFNuYXBzaG90LCBJQXJlYVNuYXBzaG90LCBJT3V0cHV0RGF0YSwgSU91dHB1dEFyZWFTaXplcyB9IGZyb20gJy4uL2ludGVyZmFjZSc7XHJcbmltcG9ydCB7IFNwbGl0QXJlYURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZS9zcGxpdEFyZWEuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgZ2V0SW5wdXRQb3NpdGl2ZU51bWJlciwgZ2V0SW5wdXRCb29sZWFuLCBpc1VzZXJTaXplc1ZhbGlkLCBnZXRBcmVhTWluU2l6ZSwgZ2V0QXJlYU1heFNpemUsIGdldFBvaW50RnJvbUV2ZW50LCBnZXRFbGVtZW50UGl4ZWxTaXplLCBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5LCB1cGRhdGVBcmVhU2l6ZSB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBhbmd1bGFyLXNwbGl0XHJcbiAqIFxyXG4gKiBcclxuICogIFBFUkNFTlQgTU9ERSAoW3VuaXRdPVwiJ3BlcmNlbnQnXCIpXHJcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfFxyXG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcclxuICogfCAgICAgICAyMCAgICAgICAgICAgICAgICAgMzAgICAgICAgICAgICAgICAgIDIwICAgICAgICAgICAgICAgICAxNSAgICAgICAgICAgICAgICAgMTUgICAgICB8IDwtLSBbc2l6ZV09XCJ4XCJcclxuICogfCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICB8IDwtLSBbZ3V0dGVyU2l6ZV09XCIxMFwiXHJcbiAqIHxjYWxjKDIwJSAtIDhweCkgICAgY2FsYygzMCUgLSAxMnB4KSAgIGNhbGMoMjAlIC0gOHB4KSAgICBjYWxjKDE1JSAtIDZweCkgICAgY2FsYygxNSUgLSA2cHgpfCA8LS0gQ1NTIGZsZXgtYmFzaXMgcHJvcGVydHkgKHdpdGggZmxleC1ncm93JnNocmluayBhdCAwKVxyXG4gKiB8ICAgICAxNTJweCAgICAgICAgICAgICAgMjI4cHggICAgICAgICAgICAgIDE1MnB4ICAgICAgICAgICAgICAxMTRweCAgICAgICAgICAgICAgMTE0cHggICAgIHwgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqIHxfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19ffFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDgwMHB4ICAgICAgICAgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqICBmbGV4LWJhc2lzID0gY2FsYyggeyBhcmVhLnNpemUgfSUgLSB7IGFyZWEuc2l6ZS8xMDAgKiBuYkd1dHRlcipndXR0ZXJTaXplIH1weCApO1xyXG4gKiBcclxuICogXHJcbiAqICBQSVhFTCBNT0RFIChbdW5pdF09XCIncGl4ZWwnXCIpXHJcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfCBcclxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XHJcbiAqIHwgICAgICAxMDAgICAgICAgICAgICAgICAgMjUwICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAxNTAgICAgICAgICAgICAgICAgMTAwICAgICAgfCA8LS0gW3NpemVdPVwieVwiXHJcbiAqIHwgICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgfCA8LS0gW2d1dHRlclNpemVdPVwiMTBcIlxyXG4gKiB8ICAgMCAwIDEwMHB4ICAgICAgICAgIDAgMCAyNTBweCAgICAgICAgICAgMSAxIGF1dG8gICAgICAgICAgMCAwIDE1MHB4ICAgICAgICAgIDAgMCAxMDBweCAgIHwgPC0tIENTUyBmbGV4IHByb3BlcnR5IChmbGV4LWdyb3cvZmxleC1zaHJpbmsvZmxleC1iYXNpcylcclxuICogfCAgICAgMTAwcHggICAgICAgICAgICAgIDI1MHB4ICAgICAgICAgICAgICAyMDBweCAgICAgICAgICAgICAgMTUwcHggICAgICAgICAgICAgIDEwMHB4ICAgICB8IDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKiB8X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3xcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4MDBweCAgICAgICAgIDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKiBcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYXMtc3BsaXQnLFxyXG4gICAgZXhwb3J0QXM6ICdhc1NwbGl0JyxcclxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gICAgc3R5bGVVcmxzOiBbYC4vc3BsaXQuY29tcG9uZW50LnNjc3NgXSxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBbbmdGb3JPZl09XCJkaXNwbGF5ZWRBcmVhc1wiIGxldC1pbmRleD1cImluZGV4XCIgbGV0LWxhc3Q9XCJsYXN0XCI+XHJcbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJsYXN0ID09PSBmYWxzZVwiIFxyXG4gICAgICAgICAgICAgICAgICNndXR0ZXJFbHNcclxuICAgICAgICAgICAgICAgICBjbGFzcz1cImFzLXNwbGl0LWd1dHRlclwiXHJcbiAgICAgICAgICAgICAgICAgW3N0eWxlLmZsZXgtYmFzaXMucHhdPVwiZ3V0dGVyU2l6ZVwiXHJcbiAgICAgICAgICAgICAgICAgW3N0eWxlLm9yZGVyXT1cImluZGV4KjIrMVwiXHJcbiAgICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJzdGFydERyYWdnaW5nKCRldmVudCwgaW5kZXgqMisxLCBpbmRleCsxKVwiXHJcbiAgICAgICAgICAgICAgICAgKHRvdWNoc3RhcnQpPVwic3RhcnREcmFnZ2luZygkZXZlbnQsIGluZGV4KjIrMSwgaW5kZXgrMSlcIlxyXG4gICAgICAgICAgICAgICAgIChtb3VzZXVwKT1cImNsaWNrR3V0dGVyKCRldmVudCwgaW5kZXgrMSlcIlxyXG4gICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJjbGlja0d1dHRlcigkZXZlbnQsIGluZGV4KzEpXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXMtc3BsaXQtZ3V0dGVyLWljb25cIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5gLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU3BsaXRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcclxuXHJcbiAgICBASW5wdXQoKSBzZXQgZGlyZWN0aW9uKHY6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAodiA9PT0gJ3ZlcnRpY2FsJykgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgYXMtJHsgdGhpcy5fZGlyZWN0aW9uIH1gKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYGFzLSR7ICh0aGlzLl9kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJyB9YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgZGlyZWN0aW9uKCk6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLy9cclxuXHJcbiAgICBwcml2YXRlIF91bml0OiAncGVyY2VudCcgfCAncGl4ZWwnID0gJ3BlcmNlbnQnO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCB1bml0KHY6ICdwZXJjZW50JyB8ICdwaXhlbCcpIHtcclxuICAgICAgICB0aGlzLl91bml0ID0gKHYgPT09ICdwaXhlbCcpID8gJ3BpeGVsJyA6ICdwZXJjZW50JztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYGFzLSR7IHRoaXMuX3VuaXQgfWApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgYXMtJHsgKHRoaXMuX3VuaXQgPT09ICdwaXhlbCcpID8gJ3BlcmNlbnQnIDogJ3BpeGVsJyB9YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB1bml0KCk6ICdwZXJjZW50JyB8ICdwaXhlbCcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91bml0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZ3V0dGVyU2l6ZTogbnVtYmVyID0gMTE7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGd1dHRlclNpemUodjogbnVtYmVyIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX2d1dHRlclNpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIDExKTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgZ3V0dGVyU2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ndXR0ZXJTaXplO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZ3V0dGVyU3RlcDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBASW5wdXQoKSBzZXQgZ3V0dGVyU3RlcCh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9ndXR0ZXJTdGVwID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCAxKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGd1dHRlclN0ZXAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3V0dGVyU3RlcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX3Jlc3RyaWN0TW92ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCByZXN0cmljdE1vdmUodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3Jlc3RyaWN0TW92ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHJlc3RyaWN0TW92ZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RNb3ZlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfdXNlVHJhbnNpdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCB1c2VUcmFuc2l0aW9uKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl91c2VUcmFuc2l0aW9uID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl91c2VUcmFuc2l0aW9uKSB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXRyYW5zaXRpb24nKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXRyYW5zaXRpb24nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHVzZVRyYW5zaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZVRyYW5zaXRpb247XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLy9cclxuXHJcbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBASW5wdXQoKSBzZXQgZGlzYWJsZWQodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9kaXNhYmxlZCkgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtZGlzYWJsZWQnKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtZGlzYWJsZWQnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZGlyOiAnbHRyJyB8ICdydGwnID0gJ2x0cic7XHJcbiAgICBcclxuICAgIEBJbnB1dCgpIHNldCBkaXIodjogJ2x0cicgfCAncnRsJykge1xyXG4gICAgICAgIHRoaXMuX2RpciA9ICh2ID09PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2RpcicsIHRoaXMuX2Rpcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBkaXIoKTogJ2x0cicgfCAncnRsJyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX2d1dHRlckRibENsaWNrRHVyYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGd1dHRlckRibENsaWNrRHVyYXRpb24odjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbiA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1dHRlckRibENsaWNrRHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElPdXRwdXREYXRhPihmYWxzZSlcclxuICAgIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxJT3V0cHV0RGF0YT4oZmFsc2UpXHJcbiAgICBAT3V0cHV0KCkgZ3V0dGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElPdXRwdXREYXRhPihmYWxzZSlcclxuICAgIEBPdXRwdXQoKSBndXR0ZXJEYmxDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SU91dHB1dERhdGE+KGZhbHNlKVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNpdGlvbkVuZFN1YnNjcmliZXI6IFN1YnNjcmliZXI8SU91dHB1dEFyZWFTaXplcz5cclxuICAgIEBPdXRwdXQoKSBnZXQgdHJhbnNpdGlvbkVuZCgpOiBPYnNlcnZhYmxlPElPdXRwdXRBcmVhU2l6ZXM+IHtcclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyID0gc3Vic2NyaWJlcikucGlwZShcclxuICAgICAgICAgICAgZGVib3VuY2VUaW1lPElPdXRwdXRBcmVhU2l6ZXM+KDIwKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgZHJhZ1Byb2dyZXNzU3ViamVjdDogU3ViamVjdDxJT3V0cHV0RGF0YT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgZHJhZ1Byb2dyZXNzJDogT2JzZXJ2YWJsZTxJT3V0cHV0RGF0YT4gPSB0aGlzLmRyYWdQcm9ncmVzc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpc1dhaXRpbmdDbGVhcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBkcmFnTGlzdGVuZXJzOiBBcnJheTxGdW5jdGlvbj4gPSBbXTtcclxuICAgIHByaXZhdGUgc25hcHNob3Q6IElTcGxpdFNuYXBzaG90IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHN0YXJ0UG9pbnQ6IElQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBlbmRQb2ludDogSVBvaW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IGRpc3BsYXllZEFyZWFzOiBBcnJheTxJQXJlYT4gPSBbXTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGlkZWRBcmVhczogQXJyYXk8SUFyZWE+ID0gW107XHJcblxyXG4gICAgQFZpZXdDaGlsZHJlbignZ3V0dGVyRWxzJykgcHJpdmF0ZSBndXR0ZXJFbHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XHJcbiAgICAgICAgLy8gVG8gZm9yY2UgYWRkaW5nIGRlZmF1bHQgY2xhc3MsIGNvdWxkIGJlIG92ZXJyaWRlIGJ5IHVzZXIgQElucHV0KCkgb3Igbm90XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFRvIGF2b2lkIHRyYW5zaXRpb24gYXQgZmlyc3QgcmVuZGVyaW5nXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1pbml0JykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGdldE5iR3V0dGVycygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDApID8gMCA6IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoIC0gMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQXJlYShjb21wb25lbnQ6IFNwbGl0QXJlYURpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG5ld0FyZWE6IElBcmVhID0ge1xyXG4gICAgICAgICAgICBjb21wb25lbnQsIFxyXG4gICAgICAgICAgICBvcmRlcjogMCwgXHJcbiAgICAgICAgICAgIHNpemU6IDAsXHJcbiAgICAgICAgICAgIG1pblNpemU6IG51bGwsXHJcbiAgICAgICAgICAgIG1heFNpemU6IG51bGwsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY29tcG9uZW50LnZpc2libGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idWlsZCh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQXJlYShjb21wb25lbnQ6IFNwbGl0QXJlYURpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuZGlzcGxheWVkQXJlYXMuc29tZShhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5zcGxpY2UodGhpcy5kaXNwbGF5ZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5oaWRlZEFyZWFzLnNvbWUoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5oaWRlZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlZEFyZWFzLnNwbGljZSh0aGlzLmhpZGVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBcmVhKGNvbXBvbmVudDogU3BsaXRBcmVhRGlyZWN0aXZlLCByZXNldE9yZGVyczogYm9vbGVhbiwgcmVzZXRTaXplczogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmKGNvbXBvbmVudC52aXNpYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGQocmVzZXRPcmRlcnMsIHJlc2V0U2l6ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd0FyZWEoY29tcG9uZW50OiBTcGxpdEFyZWFEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5oaWRlZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICBpZihhcmVhID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJlYXMgPSB0aGlzLmhpZGVkQXJlYXMuc3BsaWNlKHRoaXMuaGlkZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnB1c2goLi4uYXJlYXMpO1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlQXJlYShjb21wOiBTcGxpdEFyZWFEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5maW5kKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXApO1xyXG4gICAgICAgIGlmKGFyZWEgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhcmVhcyA9IHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICAgICAgYXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgYXJlYS5vcmRlciA9IDA7XHJcbiAgICAgICAgICAgIGFyZWEuc2l6ZSA9IDA7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmhpZGVkQXJlYXMucHVzaCguLi5hcmVhcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZpc2libGVBcmVhU2l6ZXMoKTogSU91dHB1dEFyZWFTaXplcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubWFwKGEgPT4gYS5zaXplID09PSBudWxsID8gJyonIDogYS5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmlzaWJsZUFyZWFTaXplcyhzaXplczogSU91dHB1dEFyZWFTaXplcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmKHNpemVzLmxlbmd0aCAhPT0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZm9ybWF0ZWRTaXplcyA9IHNpemVzLm1hcChzID0+IGdldElucHV0UG9zaXRpdmVOdW1iZXIocywgbnVsbCkpO1xyXG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc1VzZXJTaXplc1ZhbGlkKHRoaXMudW5pdCwgZm9ybWF0ZWRTaXplcyk7XHJcblxyXG4gICAgICAgIGlmKGlzVmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goKGFyZWEsIGkpID0+IGFyZWEuY29tcG9uZW50Ll9zaXplID0gZm9ybWF0ZWRTaXplc1tpXSk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGQoZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYnVpbGQocmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG5cclxuICAgICAgICAvLyDCpCBBUkVBUyBPUkRFUlxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHJlc2V0T3JkZXJzID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB1c2VyIHByb3ZpZGVkICdvcmRlcicgZm9yIGVhY2ggYXJlYSwgdXNlIGl0IHRvIHNvcnQgdGhlbS5cclxuICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5ldmVyeShhID0+IGEuY29tcG9uZW50Lm9yZGVyICE9PSBudWxsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5zb3J0KChhLCBiKSA9PiAoPG51bWJlcj4gYS5jb21wb25lbnQub3JkZXIpIC0gKDxudW1iZXI+IGIuY29tcG9uZW50Lm9yZGVyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBUaGVuIHNldCByZWFsIG9yZGVyIHdpdGggbXVsdGlwbGVzIG9mIDIsIG51bWJlcnMgYmV0d2VlbiB3aWxsIGJlIHVzZWQgYnkgZ3V0dGVycy5cclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLm9yZGVyID0gaSAqIDI7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZU9yZGVyKGFyZWEub3JkZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIMKkIEFSRUFTIFNJWkVcclxuICAgICAgICBcclxuICAgICAgICBpZihyZXNldFNpemVzID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZVVzZXJTaXplcyA9IGlzVXNlclNpemVzVmFsaWQodGhpcy51bml0LCB0aGlzLmRpc3BsYXllZEFyZWFzLm1hcChhID0+IGEuY29tcG9uZW50LnNpemUpKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLnVuaXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3BlcmNlbnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdFNpemUgPSAxMDAgLyB0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aDtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gdXNlVXNlclNpemVzID8gPG51bWJlcj4gYXJlYS5jb21wb25lbnQuc2l6ZSA6IGRlZmF1bHRTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdwaXhlbCc6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZih1c2VVc2VyU2l6ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gYXJlYS5jb21wb25lbnQuc2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IGdldEFyZWFNaW5TaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lsZGNhcmRTaXplQXJlYXMgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbHRlcihhID0+IGEuY29tcG9uZW50LnNpemUgPT09IG51bGwpO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHdpbGRjYXJkIGFyZWEgPiBOZWVkIHRvIHNlbGVjdCBvbmUgYXJiaXRyYXJpbHkgPiBmaXJzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPT09IDAgJiYgdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gKGkgPT09IDApID8gbnVsbCA6IGFyZWEuY29tcG9uZW50LnNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gKGkgPT09IDApID8gbnVsbCA6IGdldEFyZWFNaW5TaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IChpID09PSAwKSA/IG51bGwgOiBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vcmUgdGhhbiBvbmUgd2lsZGNhcmQgYXJlYSA+IE5lZWQgdG8ga2VlcCBvbmx5IG9uZSBhcmJpdHJhcmx5ID4gZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFscmVhZHlHb3RPbmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhcmVhLmNvbXBvbmVudC5zaXplID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFscmVhZHlHb3RPbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHJlYWR5R290T25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBhcmVhLmNvbXBvbmVudC5zaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaFN0eWxlU2l6ZXMoKTtcclxuICAgICAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaFN0eWxlU2l6ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFBFUkNFTlQgTU9ERVxyXG4gICAgICAgIGlmKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICAgICAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcclxuICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXNbMF0uY29tcG9uZW50LnNldFN0eWxlRmxleCgwLCAwLCBgMTAwJWAsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gTXVsdGlwbGUgYXJlYXMgPiB1c2UgZWFjaCBwZXJjZW50IGJhc2lzXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtR3V0dGVyU2l6ZSA9IHRoaXMuZ2V0TmJHdXR0ZXJzKCkgKiB0aGlzLmd1dHRlclNpemU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIGBjYWxjKCAkeyBhcmVhLnNpemUgfSUgLSAkeyA8bnVtYmVyPiBhcmVhLnNpemUgLyAxMDAgKiBzdW1HdXR0ZXJTaXplIH1weCApYCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGFyZWEubWluU2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1pblNpemUgPT09IGFyZWEuc2l6ZSkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChhcmVhLm1heFNpemUgIT09IG51bGwgJiYgYXJlYS5tYXhTaXplID09PSBhcmVhLnNpemUpID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFBJWEVMIE1PREVcclxuICAgICAgICBlbHNlIGlmKHRoaXMudW5pdCA9PT0gJ3BpeGVsJykge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBBcmVhIHdpdGggd2lsZGNhcmQgc2l6ZVxyXG4gICAgICAgICAgICAgICAgaWYoYXJlYS5zaXplID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDEsIDEsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlRmxleCgxLCAxLCBgYXV0b2AsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gQXJlYSB3aXRoIHBpeGVsIHNpemVcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMCwgMCwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBNdWx0aXBsZSBhcmVhcyA+IHVzZSBlYWNoIHBpeGVsIGJhc2lzXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlRmxleChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIGAkeyBhcmVhLnNpemUgfXB4YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhcmVhLm1pblNpemUgIT09IG51bGwgJiYgYXJlYS5taW5TaXplID09PSBhcmVhLnNpemUpID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2NsaWNrVGltZW91dDogbnVtYmVyIHwgbnVsbCA9IG51bGxcclxuXHJcbiAgICBwdWJsaWMgY2xpY2tHdXR0ZXIoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBndXR0ZXJOdW06IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRlbXBQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcclxuXHJcbiAgICAgICAgLy8gQmUgc3VyZSBtb3VzZXVwL3RvdWNoZW5kIGhhcHBlbmVkIGF0IHNhbWUgcG9pbnQgYXMgbW91c2Vkb3duL3RvdWNoc3RhcnQgdG8gdHJpZ2dlciBjbGljay9kYmxjbGlja1xyXG4gICAgICAgIGlmKHRoaXMuc3RhcnRQb2ludCAmJiB0aGlzLnN0YXJ0UG9pbnQueCA9PT0gdGVtcFBvaW50LnggJiYgdGhpcy5zdGFydFBvaW50LnkgPT09IHRlbXBQb2ludC55KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aW1lb3V0IGluIHByb2dyZXNzIGFuZCBuZXcgY2xpY2sgPiBjbGVhclRpbWVvdXQgJiBkYmxDbGlja0V2ZW50XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NsaWNrVGltZW91dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLl9jbGlja1RpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5KCdkYmxjbGljaycsIGd1dHRlck51bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEVsc2Ugc3RhcnQgdGltZW91dCB0byBjYWxsIGNsaWNrRXZlbnQgYXQgZW5kXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnkoJ2NsaWNrJywgZ3V0dGVyTnVtKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnREcmFnZ2luZyhldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGd1dHRlck9yZGVyOiBudW1iZXIsIGd1dHRlck51bTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydFBvaW50ID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGlmKHRoaXMuc3RhcnRQb2ludCA9PT0gbnVsbCB8fCB0aGlzLmRpc2FibGVkID09PSB0cnVlIHx8IHRoaXMuaXNXYWl0aW5nQ2xlYXIgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdCA9IHtcclxuICAgICAgICAgICAgZ3V0dGVyTnVtLFxyXG4gICAgICAgICAgICBsYXN0U3RlcHBlZE9mZnNldDogMCxcclxuICAgICAgICAgICAgYWxsQXJlYXNTaXplUGl4ZWw6IGdldEVsZW1lbnRQaXhlbFNpemUodGhpcy5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pIC0gdGhpcy5nZXROYkd1dHRlcnMoKSAqIHRoaXMuZ3V0dGVyU2l6ZSxcclxuICAgICAgICAgICAgYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50OiAxMDAsXHJcbiAgICAgICAgICAgIGFyZWFzQmVmb3JlR3V0dGVyOiBbXSxcclxuICAgICAgICAgICAgYXJlYXNBZnRlckd1dHRlcjogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhU25hcHNob3Q6IElBcmVhU25hcHNob3QgPSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLFxyXG4gICAgICAgICAgICAgICAgc2l6ZVBpeGVsQXRTdGFydDogZ2V0RWxlbWVudFBpeGVsU2l6ZShhcmVhLmNvbXBvbmVudC5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pLFxyXG4gICAgICAgICAgICAgICAgc2l6ZVBlcmNlbnRBdFN0YXJ0OiAodGhpcy51bml0ID09PSAncGVyY2VudCcpID8gYXJlYS5zaXplIDogLTEgLy8gSWYgcGl4ZWwgbW9kZSwgYW55d2F5LCB3aWxsIG5vdCBiZSB1c2VkLlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYoYXJlYS5vcmRlciA8IGd1dHRlck9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlc3RyaWN0TW92ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIgPSBbYXJlYVNuYXBzaG90XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIudW5zaGlmdChhcmVhU25hcHNob3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoYXJlYS5vcmRlciA+IGd1dHRlck9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlc3RyaWN0TW92ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlci5sZW5ndGggPT09IDApIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciA9IFthcmVhU25hcHNob3RdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdC5hcmVhc0FmdGVyR3V0dGVyLnB1c2goYXJlYVNuYXBzaG90KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNuYXBzaG90LmFsbEludm9sdmVkQXJlYXNTaXplUGVyY2VudCA9IFsuLi50aGlzLnNuYXBzaG90LmFyZWFzQmVmb3JlR3V0dGVyLCAuLi50aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXJdLnJlZHVjZSgodCwgYSkgPT4gdCthLnNpemVQZXJjZW50QXRTdGFydCwgMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlci5sZW5ndGggPT09IDAgfHwgdGhpcy5zbmFwc2hvdC5hcmVhc0FmdGVyR3V0dGVyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaCggdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKCB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hlbmQnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKCB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hjYW5jZWwnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCB0aGlzLmRyYWdFdmVudC5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaCggdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNobW92ZScsIHRoaXMuZHJhZ0V2ZW50LmJpbmQodGhpcykpICk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IGFyZWEuY29tcG9uZW50LmxvY2tFdmVudHMoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1kcmFnZ2luZycpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCwgJ2FzLWRyYWdnZWQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vdGlmeSgnc3RhcnQnLCB0aGlzLnNuYXBzaG90Lmd1dHRlck51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fY2xpY2tUaW1lb3V0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fY2xpY2tUaW1lb3V0KTtcclxuICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaXNEcmFnZ2luZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcclxuICAgICAgICBpZih0aGlzLmVuZFBvaW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBzdGVwcGVkT2Zmc2V0XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXQgPSAodGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykgPyAodGhpcy5zdGFydFBvaW50LnggLSB0aGlzLmVuZFBvaW50LngpIDogKHRoaXMuc3RhcnRQb2ludC55IC0gdGhpcy5lbmRQb2ludC55KTtcclxuICAgICAgICBpZih0aGlzLmRpciA9PT0gJ3J0bCcpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3RlcHBlZE9mZnNldCA9IE1hdGgucm91bmQob2Zmc2V0IC8gdGhpcy5ndXR0ZXJTdGVwKSAqIHRoaXMuZ3V0dGVyU3RlcDtcclxuICAgICAgICBcclxuICAgICAgICBpZihzdGVwcGVkT2Zmc2V0ID09PSB0aGlzLnNuYXBzaG90Lmxhc3RTdGVwcGVkT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdC5sYXN0U3RlcHBlZE9mZnNldCA9IHN0ZXBwZWRPZmZzZXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTmVlZCB0byBrbm93IGlmIGVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY291bGQgcmVhY3RzIHRvIHN0ZXBwZWRPZmZzZXRcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLXN0ZXBwZWRPZmZzZXQsIHRoaXMuc25hcHNob3QuYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgICAgIGxldCBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSh0aGlzLnVuaXQsIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciwgc3RlcHBlZE9mZnNldCwgdGhpcy5zbmFwc2hvdC5hbGxBcmVhc1NpemVQaXhlbCk7XHJcblxyXG4gICAgICAgIC8vIEVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY2FuJ3QgYWJzb3JiIGFsbCBvZmZzZXQgXHJcbiAgICAgICAgaWYoYXJlYXNCZWZvcmUucmVtYWluICE9PSAwICYmIGFyZWFzQWZ0ZXIucmVtYWluICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKE1hdGguYWJzKGFyZWFzQmVmb3JlLnJlbWFpbikgPT09IE1hdGguYWJzKGFyZWFzQWZ0ZXIucmVtYWluKSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoTWF0aC5hYnMoYXJlYXNCZWZvcmUucmVtYWluKSA+IE1hdGguYWJzKGFyZWFzQWZ0ZXIucmVtYWluKSkge1xyXG4gICAgICAgICAgICAgICAgYXJlYXNBZnRlciA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkodGhpcy51bml0LCB0aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXIsIHN0ZXBwZWRPZmZzZXQgKyBhcmVhc0JlZm9yZS5yZW1haW4sIHRoaXMuc25hcHNob3QuYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLCB0aGlzLnNuYXBzaG90LmFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBcmVhcyBiZWZvcmUgZ3V0dGVyIGNhbid0IGFic29yYnMgYWxsIG9mZnNldCA+IG5lZWQgdG8gcmVjYWxjdWxhdGUgc2l6ZXMgZm9yIGFyZWFzIGFmdGVyIGd1dHRlci5cclxuICAgICAgICBlbHNlIGlmKGFyZWFzQmVmb3JlLnJlbWFpbiAhPT0gMCkge1xyXG4gICAgICAgICAgICBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSh0aGlzLnVuaXQsIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciwgc3RlcHBlZE9mZnNldCArIGFyZWFzQmVmb3JlLnJlbWFpbiwgdGhpcy5zbmFwc2hvdC5hbGxBcmVhc1NpemVQaXhlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFyZWFzIGFmdGVyIGd1dHRlciBjYW4ndCBhYnNvcmJzIGFsbCBvZmZzZXQgPiBuZWVkIHRvIHJlY2FsY3VsYXRlIHNpemVzIGZvciBhcmVhcyBiZWZvcmUgZ3V0dGVyLlxyXG4gICAgICAgIGVsc2UgaWYoYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcclxuICAgICAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLCB0aGlzLnNuYXBzaG90LmFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICAgICAgICAgIC8vIEhhY2sgYmVjYXVzZSBvZiBicm93c2VyIG1lc3NpbmcgdXAgd2l0aCBzaXplcyB1c2luZyBjYWxjKFglIC0gWXB4KSAtPiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgICAgICAvLyBJZiBub3QgdGhlcmUsIHBsYXlpbmcgd2l0aCBndXR0ZXJzIG1ha2VzIHRvdGFsIGdvaW5nIGRvd24gdG8gOTkuOTk4NzUlIHRoZW4gOTkuOTkyODYlLCA5OS45ODk4NiUsLi5cclxuICAgICAgICAgICAgY29uc3QgYWxsID0gWy4uLmFyZWFzQmVmb3JlLmxpc3QsIC4uLmFyZWFzQWZ0ZXIubGlzdF07XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWFUb1Jlc2V0ID0gYWxsLmZpbmQoYSA9PiBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IDAgJiYgYS5wZXJjZW50QWZ0ZXJBYnNvcnB0aW9uICE9PSBhLmFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgJiYgYS5wZXJjZW50QWZ0ZXJBYnNvcnB0aW9uICE9PSBhLmFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUpXHJcblxyXG4gICAgICAgICAgICBpZihhcmVhVG9SZXNldCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYVRvUmVzZXQucGVyY2VudEFmdGVyQWJzb3JwdGlvbiA9IHRoaXMuc25hcHNob3QuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50IC0gYWxsLmZpbHRlcihhID0+IGEgIT09IGFyZWFUb1Jlc2V0KS5yZWR1Y2UoKHRvdGFsLCBhKSA9PiB0b3RhbCthLnBlcmNlbnRBZnRlckFic29ycHRpb24sIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3cgd2Uga25vdyBhcmVhcyBjb3VsZCBhYnNvcmIgc3RlcHBlZE9mZnNldCwgdGltZSB0byByZWFsbHkgdXBkYXRlIHNpemVzXHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYXNCZWZvcmUubGlzdC5mb3JFYWNoKGl0ZW0gPT4gdXBkYXRlQXJlYVNpemUodGhpcy51bml0LCBpdGVtKSk7XHJcbiAgICAgICAgYXJlYXNBZnRlci5saXN0LmZvckVhY2goaXRlbSA9PiB1cGRhdGVBcmVhU2l6ZSh0aGlzLnVuaXQsIGl0ZW0pKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlZnJlc2hTdHlsZVNpemVzKCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZnkoJ3Byb2dyZXNzJywgdGhpcy5zbmFwc2hvdC5ndXR0ZXJOdW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcERyYWdnaW5nKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZihldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5pc0RyYWdnaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IGFyZWEuY29tcG9uZW50LnVubG9ja0V2ZW50cygpKTtcclxuICAgICAgICBcclxuICAgICAgICB3aGlsZSh0aGlzLmRyYWdMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XHJcbiAgICAgICAgICAgIGlmKGZjdCkgZmN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFdhcm5pbmc6IEhhdmUgdG8gYmUgYmVmb3JlIFwibm90aWZ5KCdlbmQnKVwiIFxyXG4gICAgICAgIC8vIGJlY2F1c2UgXCJub3RpZnkoJ2VuZCcpXCJcIiBjYW4gYmUgbGlua2VkIHRvIFwiW3NpemVdPSd4J1wiID4gXCJidWlsZCgpXCIgPiBcInN0b3BEcmFnZ2luZygpXCJcclxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gSWYgbW92ZWQgZnJvbSBzdGFydGluZyBwb2ludCwgbm90aWZ5IGVuZFxyXG4gICAgICAgIGlmKHRoaXMuZW5kUG9pbnQgJiYgKHRoaXMuc3RhcnRQb2ludC54ICE9PSB0aGlzLmVuZFBvaW50LnggfHwgdGhpcy5zdGFydFBvaW50LnkgIT09IHRoaXMuZW5kUG9pbnQueSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ub3RpZnkoJ2VuZCcsIHRoaXMuc25hcHNob3QuZ3V0dGVyTnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1kcmFnZ2luZycpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCwgJ2FzLWRyYWdnZWQnKTtcclxuICAgICAgICB0aGlzLnNuYXBzaG90ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlzV2FpdGluZ0NsZWFyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gTmVlZGVkIHRvIGxldCAoY2xpY2spPVwiY2xpY2tHdXR0ZXIoLi4uKVwiIGV2ZW50IHJ1biBhbmQgdmVyaWZ5IGlmIG1vdXNlIG1vdmVkIG9yIG5vdFxyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzV2FpdGluZ0NsZWFyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vdGlmeSh0eXBlOiAnc3RhcnQnIHwgJ3Byb2dyZXNzJyB8ICdlbmQnIHwgJ2NsaWNrJyB8ICdkYmxjbGljaycgfCAndHJhbnNpdGlvbkVuZCcsIGd1dHRlck51bTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSB0aGlzLmdldFZpc2libGVBcmVhU2l6ZXMoKTtcclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC5lbWl0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoe2d1dHRlck51bSwgc2l6ZXN9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3V0dGVyQ2xpY2suZW1pdCh7Z3V0dGVyTnVtLCBzaXplc30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGUgPT09ICdkYmxjbGljaycpIHtcclxuICAgICAgICAgICAgdGhpcy5ndXR0ZXJEYmxDbGljay5lbWl0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ3RyYW5zaXRpb25FbmQnKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudHJhbnNpdGlvbkVuZFN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyLm5leHQoc2l6ZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGUgPT09ICdwcm9ncmVzcycpIHtcclxuICAgICAgICAgICAgLy8gU3RheSBvdXRzaWRlIHpvbmUgdG8gYWxsb3cgdXNlcnMgZG8gd2hhdCB0aGV5IHdhbnQgYWJvdXQgY2hhbmdlIGRldGVjdGlvbiBtZWNoYW5pc20uXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ1Byb2dyZXNzU3ViamVjdC5uZXh0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==