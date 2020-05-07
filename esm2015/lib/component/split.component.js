/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
export class SplitComponent {
    /**
     * @param {?} ngZone
     * @param {?} elRef
     * @param {?} cdRef
     * @param {?} renderer
     */
    constructor(ngZone, elRef, cdRef, renderer) {
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
    /**
     * @param {?} v
     * @return {?}
     */
    set direction(v) {
        this._direction = (v === 'vertical') ? 'vertical' : 'horizontal';
        this.renderer.addClass(this.elRef.nativeElement, `as-${this._direction}`);
        this.renderer.removeClass(this.elRef.nativeElement, `as-${(this._direction === 'vertical') ? 'horizontal' : 'vertical'}`);
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get direction() {
        return this._direction;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set unit(v) {
        this._unit = (v === 'pixel') ? 'pixel' : 'percent';
        this.renderer.addClass(this.elRef.nativeElement, `as-${this._unit}`);
        this.renderer.removeClass(this.elRef.nativeElement, `as-${(this._unit === 'pixel') ? 'percent' : 'pixel'}`);
        this.build(false, true);
    }
    /**
     * @return {?}
     */
    get unit() {
        return this._unit;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterSize(v) {
        this._gutterSize = getInputPositiveNumber(v, 11);
        this.build(false, false);
    }
    /**
     * @return {?}
     */
    get gutterSize() {
        return this._gutterSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterStep(v) {
        this._gutterStep = getInputPositiveNumber(v, 1);
    }
    /**
     * @return {?}
     */
    get gutterStep() {
        return this._gutterStep;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set restrictMove(v) {
        this._restrictMove = getInputBoolean(v);
    }
    /**
     * @return {?}
     */
    get restrictMove() {
        return this._restrictMove;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set useTransition(v) {
        this._useTransition = getInputBoolean(v);
        if (this._useTransition)
            this.renderer.addClass(this.elRef.nativeElement, 'as-transition');
        else
            this.renderer.removeClass(this.elRef.nativeElement, 'as-transition');
    }
    /**
     * @return {?}
     */
    get useTransition() {
        return this._useTransition;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set disabled(v) {
        this._disabled = getInputBoolean(v);
        if (this._disabled)
            this.renderer.addClass(this.elRef.nativeElement, 'as-disabled');
        else
            this.renderer.removeClass(this.elRef.nativeElement, 'as-disabled');
    }
    /**
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set dir(v) {
        this._dir = (v === 'rtl') ? 'rtl' : 'ltr';
        this.renderer.setAttribute(this.elRef.nativeElement, 'dir', this._dir);
    }
    /**
     * @return {?}
     */
    get dir() {
        return this._dir;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set gutterDblClickDuration(v) {
        this._gutterDblClickDuration = getInputPositiveNumber(v, 0);
    }
    /**
     * @return {?}
     */
    get gutterDblClickDuration() {
        return this._gutterDblClickDuration;
    }
    /**
     * @return {?}
     */
    get transitionEnd() {
        return new Observable((/**
         * @param {?} subscriber
         * @return {?}
         */
        subscriber => this.transitionEndSubscriber = subscriber)).pipe(debounceTime(20));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            // To avoid transition at first rendering
            setTimeout((/**
             * @return {?}
             */
            () => this.renderer.addClass(this.elRef.nativeElement, 'as-init')));
        }));
    }
    /**
     * @private
     * @return {?}
     */
    getNbGutters() {
        return (this.displayedAreas.length === 0) ? 0 : this.displayedAreas.length - 1;
    }
    /**
     * @param {?} component
     * @return {?}
     */
    addArea(component) {
        /** @type {?} */
        const newArea = {
            component,
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
    }
    /**
     * @param {?} component
     * @return {?}
     */
    removeArea(component) {
        if (this.displayedAreas.some((/**
         * @param {?} a
         * @return {?}
         */
        a => a.component === component))) {
            /** @type {?} */
            const area = this.displayedAreas.find((/**
             * @param {?} a
             * @return {?}
             */
            a => a.component === component));
            this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
            this.build(true, true);
        }
        else if (this.hidedAreas.some((/**
         * @param {?} a
         * @return {?}
         */
        a => a.component === component))) {
            /** @type {?} */
            const area = this.hidedAreas.find((/**
             * @param {?} a
             * @return {?}
             */
            a => a.component === component));
            this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        }
    }
    /**
     * @param {?} component
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    updateArea(component, resetOrders, resetSizes) {
        if (component.visible === true) {
            this.build(resetOrders, resetSizes);
        }
    }
    /**
     * @param {?} component
     * @return {?}
     */
    showArea(component) {
        /** @type {?} */
        const area = this.hidedAreas.find((/**
         * @param {?} a
         * @return {?}
         */
        a => a.component === component));
        if (area === undefined) {
            return;
        }
        /** @type {?} */
        const areas = this.hidedAreas.splice(this.hidedAreas.indexOf(area), 1);
        this.displayedAreas.push(...areas);
        this.build(true, true);
    }
    /**
     * @param {?} comp
     * @return {?}
     */
    hideArea(comp) {
        /** @type {?} */
        const area = this.displayedAreas.find((/**
         * @param {?} a
         * @return {?}
         */
        a => a.component === comp));
        if (area === undefined) {
            return;
        }
        /** @type {?} */
        const areas = this.displayedAreas.splice(this.displayedAreas.indexOf(area), 1);
        areas.forEach((/**
         * @param {?} area
         * @return {?}
         */
        area => {
            area.order = 0;
            area.size = 0;
        }));
        this.hidedAreas.push(...areas);
        this.build(true, true);
    }
    /**
     * @return {?}
     */
    getVisibleAreaSizes() {
        return this.displayedAreas.map((/**
         * @param {?} a
         * @return {?}
         */
        a => a.size === null ? '*' : a.size));
    }
    /**
     * @param {?} sizes
     * @return {?}
     */
    setVisibleAreaSizes(sizes) {
        if (sizes.length !== this.displayedAreas.length) {
            return false;
        }
        /** @type {?} */
        const formatedSizes = sizes.map((/**
         * @param {?} s
         * @return {?}
         */
        s => getInputPositiveNumber(s, null)));
        /** @type {?} */
        const isValid = isUserSizesValid(this.unit, formatedSizes);
        if (isValid === false) {
            return false;
        }
        // @ts-ignore
        this.displayedAreas.forEach((/**
         * @param {?} area
         * @param {?} i
         * @return {?}
         */
        (area, i) => area.component._size = formatedSizes[i]));
        this.build(false, true);
        return true;
    }
    /**
     * @private
     * @param {?} resetOrders
     * @param {?} resetSizes
     * @return {?}
     */
    build(resetOrders, resetSizes) {
        this.stopDragging();
        // ¤ AREAS ORDER
        if (resetOrders === true) {
            // If user provided 'order' for each area, use it to sort them.
            if (this.displayedAreas.every((/**
             * @param {?} a
             * @return {?}
             */
            a => a.component.order !== null))) {
                this.displayedAreas.sort((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                (a, b) => ((/** @type {?} */ (a.component.order))) - ((/** @type {?} */ (b.component.order)))));
            }
            // Then set real order with multiples of 2, numbers between will be used by gutters.
            this.displayedAreas.forEach((/**
             * @param {?} area
             * @param {?} i
             * @return {?}
             */
            (area, i) => {
                area.order = i * 2;
                area.component.setStyleOrder(area.order);
            }));
        }
        // ¤ AREAS SIZE
        if (resetSizes === true) {
            /** @type {?} */
            const useUserSizes = isUserSizesValid(this.unit, this.displayedAreas.map((/**
             * @param {?} a
             * @return {?}
             */
            a => a.component.size)));
            switch (this.unit) {
                case 'percent': {
                    /** @type {?} */
                    const defaultSize = 100 / this.displayedAreas.length;
                    this.displayedAreas.forEach((/**
                     * @param {?} area
                     * @return {?}
                     */
                    area => {
                        area.size = useUserSizes ? (/** @type {?} */ (area.component.size)) : defaultSize;
                        area.minSize = getAreaMinSize(area);
                        area.maxSize = getAreaMaxSize(area);
                    }));
                    break;
                }
                case 'pixel': {
                    if (useUserSizes) {
                        this.displayedAreas.forEach((/**
                         * @param {?} area
                         * @return {?}
                         */
                        area => {
                            area.size = area.component.size;
                            area.minSize = getAreaMinSize(area);
                            area.maxSize = getAreaMaxSize(area);
                        }));
                    }
                    else {
                        /** @type {?} */
                        const wildcardSizeAreas = this.displayedAreas.filter((/**
                         * @param {?} a
                         * @return {?}
                         */
                        a => a.component.size === null));
                        // No wildcard area > Need to select one arbitrarily > first
                        if (wildcardSizeAreas.length === 0 && this.displayedAreas.length > 0) {
                            this.displayedAreas.forEach((/**
                             * @param {?} area
                             * @param {?} i
                             * @return {?}
                             */
                            (area, i) => {
                                area.size = (i === 0) ? null : area.component.size;
                                area.minSize = (i === 0) ? null : getAreaMinSize(area);
                                area.maxSize = (i === 0) ? null : getAreaMaxSize(area);
                            }));
                        }
                        // More than one wildcard area > Need to keep only one arbitrarly > first
                        else if (wildcardSizeAreas.length > 1) {
                            /** @type {?} */
                            let alreadyGotOne = false;
                            this.displayedAreas.forEach((/**
                             * @param {?} area
                             * @return {?}
                             */
                            area => {
                                if (area.component.size === null) {
                                    if (alreadyGotOne === false) {
                                        area.size = null;
                                        area.minSize = null;
                                        area.maxSize = null;
                                        alreadyGotOne = true;
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
    }
    /**
     * @private
     * @return {?}
     */
    refreshStyleSizes() {
        ///////////////////////////////////////////
        // PERCENT MODE
        if (this.unit === 'percent') {
            // Only one area > flex-basis 100%
            if (this.displayedAreas.length === 1) {
                this.displayedAreas[0].component.setStyleFlex(0, 0, `100%`, false, false);
            }
            // Multiple areas > use each percent basis
            else {
                /** @type {?} */
                const sumGutterSize = this.getNbGutters() * this.gutterSize;
                this.displayedAreas.forEach((/**
                 * @param {?} area
                 * @return {?}
                 */
                area => {
                    area.component.setStyleFlex(0, 0, `calc( ${area.size}% - ${(/** @type {?} */ (area.size)) / 100 * sumGutterSize}px )`, (area.minSize !== null && area.minSize === area.size) ? true : false, (area.maxSize !== null && area.maxSize === area.size) ? true : false);
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
            area => {
                // Area with wildcard size
                if (area.size === null) {
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(1, 1, `100%`, false, false);
                    }
                    else {
                        area.component.setStyleFlex(1, 1, `auto`, false, false);
                    }
                }
                // Area with pixel size
                else {
                    // Only one area > flex-basis 100%
                    if (this.displayedAreas.length === 1) {
                        area.component.setStyleFlex(0, 0, `100%`, false, false);
                    }
                    // Multiple areas > use each pixel basis
                    else {
                        area.component.setStyleFlex(0, 0, `${area.size}px`, (area.minSize !== null && area.minSize === area.size) ? true : false, (area.maxSize !== null && area.maxSize === area.size) ? true : false);
                    }
                }
            }));
        }
    }
    /**
     * @param {?} event
     * @param {?} gutterNum
     * @return {?}
     */
    clickGutter(event, gutterNum) {
        /** @type {?} */
        const tempPoint = getPointFromEvent(event);
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
                () => {
                    this._clickTimeout = null;
                    this.notify('click', gutterNum);
                    this.stopDragging();
                }), this.gutterDblClickDuration);
            }
        }
    }
    /**
     * @param {?} event
     * @param {?} gutterOrder
     * @param {?} gutterNum
     * @return {?}
     */
    startDragging(event, gutterOrder, gutterNum) {
        event.preventDefault();
        event.stopPropagation();
        this.startPoint = getPointFromEvent(event);
        if (this.startPoint === null || this.disabled === true || this.isWaitingClear === true) {
            return;
        }
        this.snapshot = {
            gutterNum,
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
        area => {
            /** @type {?} */
            const areaSnapshot = {
                area,
                sizePixelAtStart: getElementPixelSize(area.component.elRef, this.direction),
                sizePercentAtStart: (this.unit === 'percent') ? area.size : -1 // If pixel mode, anyway, will not be used.
            };
            if (area.order < gutterOrder) {
                if (this.restrictMove === true) {
                    this.snapshot.areasBeforeGutter = [areaSnapshot];
                }
                else {
                    this.snapshot.areasBeforeGutter.unshift(areaSnapshot);
                }
            }
            else if (area.order > gutterOrder) {
                if (this.restrictMove === true) {
                    if (this.snapshot.areasAfterGutter.length === 0)
                        this.snapshot.areasAfterGutter = [areaSnapshot];
                }
                else {
                    this.snapshot.areasAfterGutter.push(areaSnapshot);
                }
            }
        }));
        this.snapshot.allInvolvedAreasSizePercent = [...this.snapshot.areasBeforeGutter, ...this.snapshot.areasAfterGutter].reduce((/**
         * @param {?} t
         * @param {?} a
         * @return {?}
         */
        (t, a) => t + a.sizePercentAtStart), 0);
        if (this.snapshot.areasBeforeGutter.length === 0 || this.snapshot.areasAfterGutter.length === 0) {
            return;
        }
        this.dragListeners.push(this.renderer.listen('document', 'mouseup', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchend', this.stopDragging.bind(this)));
        this.dragListeners.push(this.renderer.listen('document', 'touchcancel', this.stopDragging.bind(this)));
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.dragListeners.push(this.renderer.listen('document', 'mousemove', this.dragEvent.bind(this)));
            this.dragListeners.push(this.renderer.listen('document', 'touchmove', this.dragEvent.bind(this)));
        }));
        this.displayedAreas.forEach((/**
         * @param {?} area
         * @return {?}
         */
        area => area.component.lockEvents()));
        this.isDragging = true;
        this.renderer.addClass(this.elRef.nativeElement, 'as-dragging');
        this.renderer.addClass(this.gutterEls.toArray()[this.snapshot.gutterNum - 1].nativeElement, 'as-dragged');
        this.notify('start', this.snapshot.gutterNum);
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dragEvent(event) {
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
        let offset = (this.direction === 'horizontal') ? (this.startPoint.x - this.endPoint.x) : (this.startPoint.y - this.endPoint.y);
        if (this.dir === 'rtl') {
            offset = -offset;
        }
        /** @type {?} */
        const steppedOffset = Math.round(offset / this.gutterStep) * this.gutterStep;
        if (steppedOffset === this.snapshot.lastSteppedOffset) {
            return;
        }
        this.snapshot.lastSteppedOffset = steppedOffset;
        // Need to know if each gutter side areas could reacts to steppedOffset
        /** @type {?} */
        let areasBefore = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasBeforeGutter, -steppedOffset, this.snapshot.allAreasSizePixel);
        /** @type {?} */
        let areasAfter = getGutterSideAbsorptionCapacity(this.unit, this.snapshot.areasAfterGutter, steppedOffset, this.snapshot.allAreasSizePixel);
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
            const all = [...areasBefore.list, ...areasAfter.list];
            /** @type {?} */
            const areaToReset = all.find((/**
             * @param {?} a
             * @return {?}
             */
            a => a.percentAfterAbsorption !== 0 && a.percentAfterAbsorption !== a.areaSnapshot.area.minSize && a.percentAfterAbsorption !== a.areaSnapshot.area.maxSize));
            if (areaToReset) {
                areaToReset.percentAfterAbsorption = this.snapshot.allInvolvedAreasSizePercent - all.filter((/**
                 * @param {?} a
                 * @return {?}
                 */
                a => a !== areaToReset)).reduce((/**
                 * @param {?} total
                 * @param {?} a
                 * @return {?}
                 */
                (total, a) => total + a.percentAfterAbsorption), 0);
            }
        }
        // Now we know areas could absorb steppedOffset, time to really update sizes
        areasBefore.list.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => updateAreaSize(this.unit, item)));
        areasAfter.list.forEach((/**
         * @param {?} item
         * @return {?}
         */
        item => updateAreaSize(this.unit, item)));
        this.refreshStyleSizes();
        this.notify('progress', this.snapshot.gutterNum);
    }
    /**
     * @private
     * @param {?=} event
     * @return {?}
     */
    stopDragging(event) {
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
        area => area.component.unlockEvents()));
        while (this.dragListeners.length > 0) {
            /** @type {?} */
            const fct = this.dragListeners.pop();
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
        () => {
            setTimeout((/**
             * @return {?}
             */
            () => {
                this.startPoint = null;
                this.endPoint = null;
                this.isWaitingClear = false;
            }));
        }));
    }
    /**
     * @param {?} type
     * @param {?} gutterNum
     * @return {?}
     */
    notify(type, gutterNum) {
        /** @type {?} */
        const sizes = this.getVisibleAreaSizes();
        if (type === 'start') {
            this.dragStart.emit({ gutterNum, sizes });
        }
        else if (type === 'end') {
            this.dragEnd.emit({ gutterNum, sizes });
        }
        else if (type === 'click') {
            this.gutterClick.emit({ gutterNum, sizes });
        }
        else if (type === 'dblclick') {
            this.gutterDblClick.emit({ gutterNum, sizes });
        }
        else if (type === 'transitionEnd') {
            if (this.transitionEndSubscriber) {
                this.ngZone.run((/**
                 * @return {?}
                 */
                () => this.transitionEndSubscriber.next(sizes)));
            }
        }
        else if (type === 'progress') {
            // Stay outside zone to allow users do what they want about change detection mechanism.
            this.dragProgressSubject.next({ gutterNum, sizes });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.stopDragging();
    }
}
SplitComponent.decorators = [
    { type: Component, args: [{
                selector: 'as-split',
                exportAs: 'asSplit',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
        <ng-content></ng-content>
        <ng-template ngFor [ngForOf]="displayedAreas" let-index="index" let-last="last">
            <div *ngIf="last === false" 
                 #gutterEls
                 class="as-split-gutter"
                 [style.flex-basis.px]="gutterSize"
                 [style.order]="index*2+1"
                 (mousedown)="startDragging($event, index*2+1, index+1)"
                 (touchstart)="startDragging($event, index*2+1, index+1)"
                 (mouseup)="clickGutter($event, index+1)"
                 (touchend)="clickGutter($event, index+1)">
                <div class="as-split-gutter-icon"></div>
            </div>
        </ng-template>`,
                styles: [":host{display:flex;flex-wrap:nowrap;justify-content:flex-start;align-items:stretch;overflow:hidden;width:100%;height:100%}:host>.as-split-gutter{flex-grow:0;flex-shrink:0;background-color:#eee;display:flex;align-items:center;justify-content:center}:host>.as-split-gutter>.as-split-gutter-icon{width:100%;height:100%;background-position:center center;background-repeat:no-repeat}:host ::ng-deep>.as-split-area{flex-grow:0;flex-shrink:0;overflow-x:hidden;overflow-y:auto}:host ::ng-deep>.as-split-area.as-hidden{flex:0 1 0!important;overflow-x:hidden;overflow-y:hidden}:host.as-horizontal{flex-direction:row}:host.as-horizontal>.as-split-gutter{flex-direction:row;cursor:col-resize;height:100%}:host.as-horizontal>.as-split-gutter>.as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==)}:host.as-horizontal ::ng-deep>.as-split-area{height:100%}:host.as-vertical{flex-direction:column}:host.as-vertical>.as-split-gutter{flex-direction:column;cursor:row-resize;width:100%}:host.as-vertical>.as-split-gutter .as-split-gutter-icon{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAABlBMVEUAAADMzMzIT8AyAAAAAXRSTlMAQObYZgAAABRJREFUeAFjYGRkwIMJSeMHlBkOABP7AEGzSuPKAAAAAElFTkSuQmCC)}:host.as-vertical ::ng-deep>.as-split-area{width:100%}:host.as-vertical ::ng-deep>.as-split-area.as-hidden{max-width:0}:host.as-disabled>.as-split-gutter{cursor:default}:host.as-disabled>.as-split-gutter .as-split-gutter-icon{background-image:url(\"\")}:host.as-transition.as-init:not(.as-dragging) ::ng-deep>.as-split-area,:host.as-transition.as-init:not(.as-dragging)>.as-split-gutter{transition:flex-basis .3s}"]
            }] }
];
/** @nocollapse */
SplitComponent.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: Renderer2 }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1zcGxpdC8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnQvc3BsaXQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUE0QixVQUFVLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JNLE9BQU8sRUFBRSxVQUFVLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUk5QyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsK0JBQStCLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxRDlNLE1BQU0sT0FBTyxjQUFjOzs7Ozs7O0lBK0p2QixZQUFvQixNQUFjLEVBQ2QsS0FBaUIsRUFDakIsS0FBd0IsRUFDeEIsUUFBbUI7UUFIbkIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQWhLL0IsZUFBVSxHQUE4QixZQUFZLENBQUM7O1FBaUJyRCxVQUFLLEdBQXdCLFNBQVMsQ0FBQzs7UUFpQnZDLGdCQUFXLEdBQVcsRUFBRSxDQUFDOztRQWN6QixnQkFBVyxHQUFXLENBQUMsQ0FBQzs7UUFZeEIsa0JBQWEsR0FBWSxLQUFLLENBQUM7O1FBWS9CLG1CQUFjLEdBQVksS0FBSyxD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QUs7eUJBaUJMLEtBQUs7eUJBY0wsS0FBSzsyQkFZTCxLQUFLOzRCQVlMLEtBQUs7dUJBZUwsS0FBSztrQkFlTCxLQUFLO3FDQWNMLEtBQUs7d0JBVUwsTUFBTTtzQkFDTixNQUFNOzBCQUNOLE1BQU07NkJBQ04sTUFBTTs0QkFHTixNQUFNO3dCQXFCTixZQUFZLFNBQUMsV0FBVzs7Ozs7OztJQTNKekIsb0NBQTZEOzs7OztJQWlCN0QsK0JBQStDOzs7OztJQWlCL0MscUNBQWlDOzs7OztJQWNqQyxxQ0FBZ0M7Ozs7O0lBWWhDLHVDQUF1Qzs7Ozs7SUFZdkMsd0NBQXdDOzs7OztJQWV4QyxtQ0FBbUM7Ozs7O0lBZW5DLDhCQUFvQzs7Ozs7SUFjcEMsaURBQTRDOztJQVk1QyxtQ0FBMEQ7O0lBQzFELGlDQUF3RDs7SUFDeEQscUNBQTREOztJQUM1RCx3Q0FBK0Q7Ozs7O0lBRS9ELGlEQUE2RDs7Ozs7SUFPN0QsNkNBQWtFOztJQUNsRSx1Q0FBaUY7Ozs7O0lBSWpGLG9DQUFvQzs7Ozs7SUFDcEMsd0NBQXdDOzs7OztJQUN4Qyx1Q0FBNEM7Ozs7O0lBQzVDLGtDQUErQzs7Ozs7SUFDL0Msb0NBQXlDOzs7OztJQUN6QyxrQ0FBdUM7O0lBRXZDLHdDQUFrRDs7Ozs7SUFDbEQsb0NBQStDOzs7OztJQUUvQyxtQ0FBb0U7O0lBNlBwRSx1Q0FBbUM7Ozs7O0lBM1B2QixnQ0FBc0I7Ozs7O0lBQ3RCLCtCQUF5Qjs7Ozs7SUFDekIsK0JBQWdDOzs7OztJQUNoQyxrQ0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgUmVuZGVyZXIyLCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIEVsZW1lbnRSZWYsIE5nWm9uZSwgVmlld0NoaWxkcmVuLCBRdWVyeUxpc3QsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJzY3JpYmVyLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7IElBcmVhLCBJUG9pbnQsIElTcGxpdFNuYXBzaG90LCBJQXJlYVNuYXBzaG90LCBJT3V0cHV0RGF0YSwgSU91dHB1dEFyZWFTaXplcyB9IGZyb20gJy4uL2ludGVyZmFjZSc7XHJcbmltcG9ydCB7IFNwbGl0QXJlYURpcmVjdGl2ZSB9IGZyb20gJy4uL2RpcmVjdGl2ZS9zcGxpdEFyZWEuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgZ2V0SW5wdXRQb3NpdGl2ZU51bWJlciwgZ2V0SW5wdXRCb29sZWFuLCBpc1VzZXJTaXplc1ZhbGlkLCBnZXRBcmVhTWluU2l6ZSwgZ2V0QXJlYU1heFNpemUsIGdldFBvaW50RnJvbUV2ZW50LCBnZXRFbGVtZW50UGl4ZWxTaXplLCBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5LCB1cGRhdGVBcmVhU2l6ZSB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbi8qKlxyXG4gKiBhbmd1bGFyLXNwbGl0XHJcbiAqIFxyXG4gKiBcclxuICogIFBFUkNFTlQgTU9ERSAoW3VuaXRdPVwiJ3BlcmNlbnQnXCIpXHJcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfFxyXG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcclxuICogfCAgICAgICAyMCAgICAgICAgICAgICAgICAgMzAgICAgICAgICAgICAgICAgIDIwICAgICAgICAgICAgICAgICAxNSAgICAgICAgICAgICAgICAgMTUgICAgICB8IDwtLSBbc2l6ZV09XCJ4XCJcclxuICogfCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICB8IDwtLSBbZ3V0dGVyU2l6ZV09XCIxMFwiXHJcbiAqIHxjYWxjKDIwJSAtIDhweCkgICAgY2FsYygzMCUgLSAxMnB4KSAgIGNhbGMoMjAlIC0gOHB4KSAgICBjYWxjKDE1JSAtIDZweCkgICAgY2FsYygxNSUgLSA2cHgpfCA8LS0gQ1NTIGZsZXgtYmFzaXMgcHJvcGVydHkgKHdpdGggZmxleC1ncm93JnNocmluayBhdCAwKVxyXG4gKiB8ICAgICAxNTJweCAgICAgICAgICAgICAgMjI4cHggICAgICAgICAgICAgIDE1MnB4ICAgICAgICAgICAgICAxMTRweCAgICAgICAgICAgICAgMTE0cHggICAgIHwgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqIHxfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19ffFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDgwMHB4ICAgICAgICAgPC0tIGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoXHJcbiAqICBmbGV4LWJhc2lzID0gY2FsYyggeyBhcmVhLnNpemUgfSUgLSB7IGFyZWEuc2l6ZS8xMDAgKiBuYkd1dHRlcipndXR0ZXJTaXplIH1weCApO1xyXG4gKiBcclxuICogXHJcbiAqICBQSVhFTCBNT0RFIChbdW5pdF09XCIncGl4ZWwnXCIpXHJcbiAqICBfX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXHJcbiAqIHwgICAgICAgQSAgICAgICBbZzFdICAgICAgIEIgICAgICAgW2cyXSAgICAgICBDICAgICAgIFtnM10gICAgICAgRCAgICAgICBbZzRdICAgICAgIEUgICAgICAgfCBcclxuICogfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XHJcbiAqIHwgICAgICAxMDAgICAgICAgICAgICAgICAgMjUwICAgICAgICAgICAgICAgICAqICAgICAgICAgICAgICAgICAxNTAgICAgICAgICAgICAgICAgMTAwICAgICAgfCA8LS0gW3NpemVdPVwieVwiXHJcbiAqIHwgICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgMTBweCAgICAgICAgICAgICAgIDEwcHggICAgICAgICAgICAgICAxMHB4ICAgICAgICAgICAgICAgfCA8LS0gW2d1dHRlclNpemVdPVwiMTBcIlxyXG4gKiB8ICAgMCAwIDEwMHB4ICAgICAgICAgIDAgMCAyNTBweCAgICAgICAgICAgMSAxIGF1dG8gICAgICAgICAgMCAwIDE1MHB4ICAgICAgICAgIDAgMCAxMDBweCAgIHwgPC0tIENTUyBmbGV4IHByb3BlcnR5IChmbGV4LWdyb3cvZmxleC1zaHJpbmsvZmxleC1iYXNpcylcclxuICogfCAgICAgMTAwcHggICAgICAgICAgICAgIDI1MHB4ICAgICAgICAgICAgICAyMDBweCAgICAgICAgICAgICAgMTUwcHggICAgICAgICAgICAgIDEwMHB4ICAgICB8IDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKiB8X19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX3xcclxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4MDBweCAgICAgICAgIDwtLSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aFxyXG4gKiBcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAgIHNlbGVjdG9yOiAnYXMtc3BsaXQnLFxyXG4gICAgZXhwb3J0QXM6ICdhc1NwbGl0JyxcclxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gICAgc3R5bGVVcmxzOiBbYC4vc3BsaXQuY29tcG9uZW50LnNjc3NgXSxcclxuICAgIHRlbXBsYXRlOiBgXHJcbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBbbmdGb3JPZl09XCJkaXNwbGF5ZWRBcmVhc1wiIGxldC1pbmRleD1cImluZGV4XCIgbGV0LWxhc3Q9XCJsYXN0XCI+XHJcbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJsYXN0ID09PSBmYWxzZVwiIFxyXG4gICAgICAgICAgICAgICAgICNndXR0ZXJFbHNcclxuICAgICAgICAgICAgICAgICBjbGFzcz1cImFzLXNwbGl0LWd1dHRlclwiXHJcbiAgICAgICAgICAgICAgICAgW3N0eWxlLmZsZXgtYmFzaXMucHhdPVwiZ3V0dGVyU2l6ZVwiXHJcbiAgICAgICAgICAgICAgICAgW3N0eWxlLm9yZGVyXT1cImluZGV4KjIrMVwiXHJcbiAgICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJzdGFydERyYWdnaW5nKCRldmVudCwgaW5kZXgqMisxLCBpbmRleCsxKVwiXHJcbiAgICAgICAgICAgICAgICAgKHRvdWNoc3RhcnQpPVwic3RhcnREcmFnZ2luZygkZXZlbnQsIGluZGV4KjIrMSwgaW5kZXgrMSlcIlxyXG4gICAgICAgICAgICAgICAgIChtb3VzZXVwKT1cImNsaWNrR3V0dGVyKCRldmVudCwgaW5kZXgrMSlcIlxyXG4gICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJjbGlja0d1dHRlcigkZXZlbnQsIGluZGV4KzEpXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXMtc3BsaXQtZ3V0dGVyLWljb25cIj48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5gLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgU3BsaXRDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICAgIHByaXZhdGUgX2RpcmVjdGlvbjogJ2hvcml6b250YWwnIHwgJ3ZlcnRpY2FsJyA9ICdob3Jpem9udGFsJztcclxuXHJcbiAgICBASW5wdXQoKSBzZXQgZGlyZWN0aW9uKHY6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcpIHtcclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSAodiA9PT0gJ3ZlcnRpY2FsJykgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgYXMtJHsgdGhpcy5fZGlyZWN0aW9uIH1gKTtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYGFzLSR7ICh0aGlzLl9kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpID8gJ2hvcml6b250YWwnIDogJ3ZlcnRpY2FsJyB9YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgZGlyZWN0aW9uKCk6ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLy9cclxuXHJcbiAgICBwcml2YXRlIF91bml0OiAncGVyY2VudCcgfCAncGl4ZWwnID0gJ3BlcmNlbnQnO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCB1bml0KHY6ICdwZXJjZW50JyB8ICdwaXhlbCcpIHtcclxuICAgICAgICB0aGlzLl91bml0ID0gKHYgPT09ICdwaXhlbCcpID8gJ3BpeGVsJyA6ICdwZXJjZW50JztcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgYGFzLSR7IHRoaXMuX3VuaXQgfWApO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCBgYXMtJHsgKHRoaXMuX3VuaXQgPT09ICdwaXhlbCcpID8gJ3BlcmNlbnQnIDogJ3BpeGVsJyB9YCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCB1bml0KCk6ICdwZXJjZW50JyB8ICdwaXhlbCcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91bml0O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZ3V0dGVyU2l6ZTogbnVtYmVyID0gMTE7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGd1dHRlclNpemUodjogbnVtYmVyIHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX2d1dHRlclNpemUgPSBnZXRJbnB1dFBvc2l0aXZlTnVtYmVyKHYsIDExKTtcclxuXHJcbiAgICAgICAgdGhpcy5idWlsZChmYWxzZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXQgZ3V0dGVyU2l6ZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ndXR0ZXJTaXplO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZ3V0dGVyU3RlcDogbnVtYmVyID0gMTtcclxuXHJcbiAgICBASW5wdXQoKSBzZXQgZ3V0dGVyU3RlcCh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9ndXR0ZXJTdGVwID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCAxKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGd1dHRlclN0ZXAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3V0dGVyU3RlcDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX3Jlc3RyaWN0TW92ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCByZXN0cmljdE1vdmUodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3Jlc3RyaWN0TW92ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHJlc3RyaWN0TW92ZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdHJpY3RNb3ZlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfdXNlVHJhbnNpdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCB1c2VUcmFuc2l0aW9uKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl91c2VUcmFuc2l0aW9uID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl91c2VUcmFuc2l0aW9uKSB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXRyYW5zaXRpb24nKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXRyYW5zaXRpb24nKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHVzZVRyYW5zaXRpb24oKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZVRyYW5zaXRpb247XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vLy9cclxuXHJcbiAgICBwcml2YXRlIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgXHJcbiAgICBASW5wdXQoKSBzZXQgZGlzYWJsZWQodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZ2V0SW5wdXRCb29sZWFuKHYpO1xyXG5cclxuICAgICAgICBpZih0aGlzLl9kaXNhYmxlZCkgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtZGlzYWJsZWQnKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtZGlzYWJsZWQnKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfZGlyOiAnbHRyJyB8ICdydGwnID0gJ2x0cic7XHJcbiAgICBcclxuICAgIEBJbnB1dCgpIHNldCBkaXIodjogJ2x0cicgfCAncnRsJykge1xyXG4gICAgICAgIHRoaXMuX2RpciA9ICh2ID09PSAncnRsJykgPyAncnRsJyA6ICdsdHInO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2RpcicsIHRoaXMuX2Rpcik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBkaXIoKTogJ2x0cicgfCAncnRsJyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcjtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX2d1dHRlckRibENsaWNrRHVyYXRpb246IG51bWJlciA9IDA7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGd1dHRlckRibENsaWNrRHVyYXRpb24odjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZ3V0dGVyRGJsQ2xpY2tEdXJhdGlvbiA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgMCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBndXR0ZXJEYmxDbGlja0R1cmF0aW9uKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2d1dHRlckRibENsaWNrRHVyYXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIEBPdXRwdXQoKSBkcmFnU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElPdXRwdXREYXRhPihmYWxzZSlcclxuICAgIEBPdXRwdXQoKSBkcmFnRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxJT3V0cHV0RGF0YT4oZmFsc2UpXHJcbiAgICBAT3V0cHV0KCkgZ3V0dGVyQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPElPdXRwdXREYXRhPihmYWxzZSlcclxuICAgIEBPdXRwdXQoKSBndXR0ZXJEYmxDbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8SU91dHB1dERhdGE+KGZhbHNlKVxyXG5cclxuICAgIHByaXZhdGUgdHJhbnNpdGlvbkVuZFN1YnNjcmliZXI6IFN1YnNjcmliZXI8SU91dHB1dEFyZWFTaXplcz5cclxuICAgIEBPdXRwdXQoKSBnZXQgdHJhbnNpdGlvbkVuZCgpOiBPYnNlcnZhYmxlPElPdXRwdXRBcmVhU2l6ZXM+IHtcclxuICAgICAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyID0gc3Vic2NyaWJlcikucGlwZShcclxuICAgICAgICAgICAgZGVib3VuY2VUaW1lPElPdXRwdXRBcmVhU2l6ZXM+KDIwKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgZHJhZ1Byb2dyZXNzU3ViamVjdDogU3ViamVjdDxJT3V0cHV0RGF0YT4gPSBuZXcgU3ViamVjdCgpO1xyXG4gICAgZHJhZ1Byb2dyZXNzJDogT2JzZXJ2YWJsZTxJT3V0cHV0RGF0YT4gPSB0aGlzLmRyYWdQcm9ncmVzc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgaXNEcmFnZ2luZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBpc1dhaXRpbmdDbGVhcjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBkcmFnTGlzdGVuZXJzOiBBcnJheTxGdW5jdGlvbj4gPSBbXTtcclxuICAgIHByaXZhdGUgc25hcHNob3Q6IElTcGxpdFNuYXBzaG90IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHN0YXJ0UG9pbnQ6IElQb2ludCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBlbmRQb2ludDogSVBvaW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIHJlYWRvbmx5IGRpc3BsYXllZEFyZWFzOiBBcnJheTxJQXJlYT4gPSBbXTtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgaGlkZWRBcmVhczogQXJyYXk8SUFyZWE+ID0gW107XHJcblxyXG4gICAgQFZpZXdDaGlsZHJlbignZ3V0dGVyRWxzJykgcHJpdmF0ZSBndXR0ZXJFbHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XHJcbiAgICAgICAgLy8gVG8gZm9yY2UgYWRkaW5nIGRlZmF1bHQgY2xhc3MsIGNvdWxkIGJlIG92ZXJyaWRlIGJ5IHVzZXIgQElucHV0KCkgb3Igbm90XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB0aGlzLl9kaXJlY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFRvIGF2b2lkIHRyYW5zaXRpb24gYXQgZmlyc3QgcmVuZGVyaW5nXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1pbml0JykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIGdldE5iR3V0dGVycygpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDApID8gMCA6IHRoaXMuZGlzcGxheWVkQXJlYXMubGVuZ3RoIC0gMTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQXJlYShjb21wb25lbnQ6IFNwbGl0QXJlYURpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IG5ld0FyZWE6IElBcmVhID0ge1xyXG4gICAgICAgICAgICBjb21wb25lbnQsIFxyXG4gICAgICAgICAgICBvcmRlcjogMCwgXHJcbiAgICAgICAgICAgIHNpemU6IDAsXHJcbiAgICAgICAgICAgIG1pblNpemU6IG51bGwsXHJcbiAgICAgICAgICAgIG1heFNpemU6IG51bGwsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYoY29tcG9uZW50LnZpc2libGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idWlsZCh0cnVlLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZWRBcmVhcy5wdXNoKG5ld0FyZWEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlQXJlYShjb21wb25lbnQ6IFNwbGl0QXJlYURpcmVjdGl2ZSk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuZGlzcGxheWVkQXJlYXMuc29tZShhID0+IGEuY29tcG9uZW50ID09PSBjb21wb25lbnQpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWEgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5zcGxpY2UodGhpcy5kaXNwbGF5ZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodGhpcy5oaWRlZEFyZWFzLnNvbWUoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5oaWRlZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICAgICAgdGhpcy5oaWRlZEFyZWFzLnNwbGljZSh0aGlzLmhpZGVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVBcmVhKGNvbXBvbmVudDogU3BsaXRBcmVhRGlyZWN0aXZlLCByZXNldE9yZGVyczogYm9vbGVhbiwgcmVzZXRTaXplczogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmKGNvbXBvbmVudC52aXNpYmxlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGQocmVzZXRPcmRlcnMsIHJlc2V0U2l6ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd0FyZWEoY29tcG9uZW50OiBTcGxpdEFyZWFEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5oaWRlZEFyZWFzLmZpbmQoYSA9PiBhLmNvbXBvbmVudCA9PT0gY29tcG9uZW50KTtcclxuICAgICAgICBpZihhcmVhID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgYXJlYXMgPSB0aGlzLmhpZGVkQXJlYXMuc3BsaWNlKHRoaXMuaGlkZWRBcmVhcy5pbmRleE9mKGFyZWEpLCAxKTtcclxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLnB1c2goLi4uYXJlYXMpO1xyXG5cclxuICAgICAgICB0aGlzLmJ1aWxkKHRydWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWRlQXJlYShjb21wOiBTcGxpdEFyZWFEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBhcmVhID0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5maW5kKGEgPT4gYS5jb21wb25lbnQgPT09IGNvbXApO1xyXG4gICAgICAgIGlmKGFyZWEgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhcmVhcyA9IHRoaXMuZGlzcGxheWVkQXJlYXMuc3BsaWNlKHRoaXMuZGlzcGxheWVkQXJlYXMuaW5kZXhPZihhcmVhKSwgMSk7XHJcbiAgICAgICAgYXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgYXJlYS5vcmRlciA9IDA7XHJcbiAgICAgICAgICAgIGFyZWEuc2l6ZSA9IDA7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmhpZGVkQXJlYXMucHVzaCguLi5hcmVhcyk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGQodHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFZpc2libGVBcmVhU2l6ZXMoKTogSU91dHB1dEFyZWFTaXplcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGxheWVkQXJlYXMubWFwKGEgPT4gYS5zaXplID09PSBudWxsID8gJyonIDogYS5zaXplKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0VmlzaWJsZUFyZWFTaXplcyhzaXplczogSU91dHB1dEFyZWFTaXplcyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmKHNpemVzLmxlbmd0aCAhPT0gdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZm9ybWF0ZWRTaXplcyA9IHNpemVzLm1hcChzID0+IGdldElucHV0UG9zaXRpdmVOdW1iZXIocywgbnVsbCkpO1xyXG4gICAgICAgIGNvbnN0IGlzVmFsaWQgPSBpc1VzZXJTaXplc1ZhbGlkKHRoaXMudW5pdCwgZm9ybWF0ZWRTaXplcyk7XHJcblxyXG4gICAgICAgIGlmKGlzVmFsaWQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goKGFyZWEsIGkpID0+IGFyZWEuY29tcG9uZW50Ll9zaXplID0gZm9ybWF0ZWRTaXplc1tpXSk7XHJcblxyXG4gICAgICAgIHRoaXMuYnVpbGQoZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYnVpbGQocmVzZXRPcmRlcnM6IGJvb2xlYW4sIHJlc2V0U2l6ZXM6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG5cclxuICAgICAgICAvLyDCpCBBUkVBUyBPUkRFUlxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKHJlc2V0T3JkZXJzID09PSB0cnVlKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB1c2VyIHByb3ZpZGVkICdvcmRlcicgZm9yIGVhY2ggYXJlYSwgdXNlIGl0IHRvIHNvcnQgdGhlbS5cclxuICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5ldmVyeShhID0+IGEuY29tcG9uZW50Lm9yZGVyICE9PSBudWxsKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5zb3J0KChhLCBiKSA9PiAoPG51bWJlcj4gYS5jb21wb25lbnQub3JkZXIpIC0gKDxudW1iZXI+IGIuY29tcG9uZW50Lm9yZGVyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBUaGVuIHNldCByZWFsIG9yZGVyIHdpdGggbXVsdGlwbGVzIG9mIDIsIG51bWJlcnMgYmV0d2VlbiB3aWxsIGJlIHVzZWQgYnkgZ3V0dGVycy5cclxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLm9yZGVyID0gaSAqIDI7XHJcbiAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZU9yZGVyKGFyZWEub3JkZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIMKkIEFSRUFTIFNJWkVcclxuICAgICAgICBcclxuICAgICAgICBpZihyZXNldFNpemVzID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZVVzZXJTaXplcyA9IGlzVXNlclNpemVzVmFsaWQodGhpcy51bml0LCB0aGlzLmRpc3BsYXllZEFyZWFzLm1hcChhID0+IGEuY29tcG9uZW50LnNpemUpKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCh0aGlzLnVuaXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3BlcmNlbnQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdFNpemUgPSAxMDAgLyB0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aDtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gdXNlVXNlclNpemVzID8gPG51bWJlcj4gYXJlYS5jb21wb25lbnQuc2l6ZSA6IGRlZmF1bHRTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXNlICdwaXhlbCc6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZih1c2VVc2VyU2l6ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gYXJlYS5jb21wb25lbnQuc2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IGdldEFyZWFNaW5TaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgd2lsZGNhcmRTaXplQXJlYXMgPSB0aGlzLmRpc3BsYXllZEFyZWFzLmZpbHRlcihhID0+IGEuY29tcG9uZW50LnNpemUgPT09IG51bGwpO1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vIHdpbGRjYXJkIGFyZWEgPiBOZWVkIHRvIHNlbGVjdCBvbmUgYXJiaXRyYXJpbHkgPiBmaXJzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPT09IDAgJiYgdGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKChhcmVhLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5zaXplID0gKGkgPT09IDApID8gbnVsbCA6IGFyZWEuY29tcG9uZW50LnNpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gKGkgPT09IDApID8gbnVsbCA6IGdldEFyZWFNaW5TaXplKGFyZWEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IChpID09PSAwKSA/IG51bGwgOiBnZXRBcmVhTWF4U2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE1vcmUgdGhhbiBvbmUgd2lsZGNhcmQgYXJlYSA+IE5lZWQgdG8ga2VlcCBvbmx5IG9uZSBhcmJpdHJhcmx5ID4gZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZih3aWxkY2FyZFNpemVBcmVhcy5sZW5ndGggPiAxKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGFscmVhZHlHb3RPbmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihhcmVhLmNvbXBvbmVudC5zaXplID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGFscmVhZHlHb3RPbmUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5taW5TaXplID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWF4U2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHJlYWR5R290T25lID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuc2l6ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEubWluU2l6ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1heFNpemUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLnNpemUgPSBhcmVhLmNvbXBvbmVudC5zaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1pblNpemUgPSBnZXRBcmVhTWluU2l6ZShhcmVhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tYXhTaXplID0gZ2V0QXJlYU1heFNpemUoYXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaFN0eWxlU2l6ZXMoKTtcclxuICAgICAgICB0aGlzLmNkUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVmcmVzaFN0eWxlU2l6ZXMoKTogdm9pZCB7XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFBFUkNFTlQgTU9ERVxyXG4gICAgICAgIGlmKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICAgICAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcclxuICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXNbMF0uY29tcG9uZW50LnNldFN0eWxlRmxleCgwLCAwLCBgMTAwJWAsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gTXVsdGlwbGUgYXJlYXMgPiB1c2UgZWFjaCBwZXJjZW50IGJhc2lzXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtR3V0dGVyU2l6ZSA9IHRoaXMuZ2V0TmJHdXR0ZXJzKCkgKiB0aGlzLmd1dHRlclNpemU7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIGBjYWxjKCAkeyBhcmVhLnNpemUgfSUgLSAkeyA8bnVtYmVyPiBhcmVhLnNpemUgLyAxMDAgKiBzdW1HdXR0ZXJTaXplIH1weCApYCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGFyZWEubWluU2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1pblNpemUgPT09IGFyZWEuc2l6ZSkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChhcmVhLm1heFNpemUgIT09IG51bGwgJiYgYXJlYS5tYXhTaXplID09PSBhcmVhLnNpemUpID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFBJWEVMIE1PREVcclxuICAgICAgICBlbHNlIGlmKHRoaXMudW5pdCA9PT0gJ3BpeGVsJykge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXllZEFyZWFzLmZvckVhY2goYXJlYSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBBcmVhIHdpdGggd2lsZGNhcmQgc2l6ZVxyXG4gICAgICAgICAgICAgICAgaWYoYXJlYS5zaXplID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5kaXNwbGF5ZWRBcmVhcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5jb21wb25lbnQuc2V0U3R5bGVGbGV4KDEsIDEsIGAxMDAlYCwgZmFsc2UsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlRmxleCgxLCAxLCBgYXV0b2AsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gQXJlYSB3aXRoIHBpeGVsIHNpemVcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgb25lIGFyZWEgPiBmbGV4LWJhc2lzIDEwMCVcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmRpc3BsYXllZEFyZWFzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhLmNvbXBvbmVudC5zZXRTdHlsZUZsZXgoMCwgMCwgYDEwMCVgLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBNdWx0aXBsZSBhcmVhcyA+IHVzZSBlYWNoIHBpeGVsIGJhc2lzXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZWEuY29tcG9uZW50LnNldFN0eWxlRmxleChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAsIDAsIGAkeyBhcmVhLnNpemUgfXB4YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChhcmVhLm1pblNpemUgIT09IG51bGwgJiYgYXJlYS5taW5TaXplID09PSBhcmVhLnNpemUpID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiBhcmVhLm1heFNpemUgPT09IGFyZWEuc2l6ZSkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgX2NsaWNrVGltZW91dDogbnVtYmVyIHwgbnVsbCA9IG51bGxcclxuXHJcbiAgICBwdWJsaWMgY2xpY2tHdXR0ZXIoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LCBndXR0ZXJOdW06IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRlbXBQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcclxuXHJcbiAgICAgICAgLy8gQmUgc3VyZSBtb3VzZXVwL3RvdWNoZW5kIGhhcHBlbmVkIGF0IHNhbWUgcG9pbnQgYXMgbW91c2Vkb3duL3RvdWNoc3RhcnQgdG8gdHJpZ2dlciBjbGljay9kYmxjbGlja1xyXG4gICAgICAgIGlmKHRoaXMuc3RhcnRQb2ludCAmJiB0aGlzLnN0YXJ0UG9pbnQueCA9PT0gdGVtcFBvaW50LnggJiYgdGhpcy5zdGFydFBvaW50LnkgPT09IHRlbXBQb2ludC55KSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aW1lb3V0IGluIHByb2dyZXNzIGFuZCBuZXcgY2xpY2sgPiBjbGVhclRpbWVvdXQgJiBkYmxDbGlja0V2ZW50XHJcbiAgICAgICAgICAgIGlmKHRoaXMuX2NsaWNrVGltZW91dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLl9jbGlja1RpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5KCdkYmxjbGljaycsIGd1dHRlck51bSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEVsc2Ugc3RhcnQgdGltZW91dCB0byBjYWxsIGNsaWNrRXZlbnQgYXQgZW5kXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NsaWNrVGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ub3RpZnkoJ2NsaWNrJywgZ3V0dGVyTnVtKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5ndXR0ZXJEYmxDbGlja0R1cmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnREcmFnZ2luZyhldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGd1dHRlck9yZGVyOiBudW1iZXIsIGd1dHRlck51bTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGFydFBvaW50ID0gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQpO1xyXG4gICAgICAgIGlmKHRoaXMuc3RhcnRQb2ludCA9PT0gbnVsbCB8fCB0aGlzLmRpc2FibGVkID09PSB0cnVlIHx8IHRoaXMuaXNXYWl0aW5nQ2xlYXIgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdCA9IHtcclxuICAgICAgICAgICAgZ3V0dGVyTnVtLFxyXG4gICAgICAgICAgICBsYXN0U3RlcHBlZE9mZnNldDogMCxcclxuICAgICAgICAgICAgYWxsQXJlYXNTaXplUGl4ZWw6IGdldEVsZW1lbnRQaXhlbFNpemUodGhpcy5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pIC0gdGhpcy5nZXROYkd1dHRlcnMoKSAqIHRoaXMuZ3V0dGVyU2l6ZSxcclxuICAgICAgICAgICAgYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50OiAxMDAsXHJcbiAgICAgICAgICAgIGFyZWFzQmVmb3JlR3V0dGVyOiBbXSxcclxuICAgICAgICAgICAgYXJlYXNBZnRlckd1dHRlcjogW10sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRBcmVhcy5mb3JFYWNoKGFyZWEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhcmVhU25hcHNob3Q6IElBcmVhU25hcHNob3QgPSB7XHJcbiAgICAgICAgICAgICAgICBhcmVhLFxyXG4gICAgICAgICAgICAgICAgc2l6ZVBpeGVsQXRTdGFydDogZ2V0RWxlbWVudFBpeGVsU2l6ZShhcmVhLmNvbXBvbmVudC5lbFJlZiwgdGhpcy5kaXJlY3Rpb24pLFxyXG4gICAgICAgICAgICAgICAgc2l6ZVBlcmNlbnRBdFN0YXJ0OiAodGhpcy51bml0ID09PSAncGVyY2VudCcpID8gYXJlYS5zaXplIDogLTEgLy8gSWYgcGl4ZWwgbW9kZSwgYW55d2F5LCB3aWxsIG5vdCBiZSB1c2VkLlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYoYXJlYS5vcmRlciA8IGd1dHRlck9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlc3RyaWN0TW92ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIgPSBbYXJlYVNuYXBzaG90XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc25hcHNob3QuYXJlYXNCZWZvcmVHdXR0ZXIudW5zaGlmdChhcmVhU25hcHNob3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoYXJlYS5vcmRlciA+IGd1dHRlck9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlc3RyaWN0TW92ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlci5sZW5ndGggPT09IDApIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciA9IFthcmVhU25hcHNob3RdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zbmFwc2hvdC5hcmVhc0FmdGVyR3V0dGVyLnB1c2goYXJlYVNuYXBzaG90KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNuYXBzaG90LmFsbEludm9sdmVkQXJlYXNTaXplUGVyY2VudCA9IFsuLi50aGlzLnNuYXBzaG90LmFyZWFzQmVmb3JlR3V0dGVyLCAuLi50aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXJdLnJlZHVjZSgodCwgYSkgPT4gdCthLnNpemVQZXJjZW50QXRTdGFydCwgMCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlci5sZW5ndGggPT09IDAgfHwgdGhpcy5zbmFwc2hvdC5hcmVhc0FmdGVyR3V0dGVyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaCggdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKCB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hlbmQnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVycy5wdXNoKCB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAndG91Y2hjYW5jZWwnLCB0aGlzLnN0b3BEcmFnZ2luZy5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCB0aGlzLmRyYWdFdmVudC5iaW5kKHRoaXMpKSApO1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lcnMucHVzaCggdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ3RvdWNobW92ZScsIHRoaXMuZHJhZ0V2ZW50LmJpbmQodGhpcykpICk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IGFyZWEuY29tcG9uZW50LmxvY2tFdmVudHMoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1kcmFnZ2luZycpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCwgJ2FzLWRyYWdnZWQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLm5vdGlmeSgnc3RhcnQnLCB0aGlzLnNuYXBzaG90Lmd1dHRlck51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkcmFnRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5fY2xpY2tUaW1lb3V0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGhpcy5fY2xpY2tUaW1lb3V0KTtcclxuICAgICAgICAgICAgdGhpcy5fY2xpY2tUaW1lb3V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuaXNEcmFnZ2luZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IGdldFBvaW50RnJvbUV2ZW50KGV2ZW50KTtcclxuICAgICAgICBpZih0aGlzLmVuZFBvaW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBzdGVwcGVkT2Zmc2V0XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXQgPSAodGhpcy5kaXJlY3Rpb24gPT09ICdob3Jpem9udGFsJykgPyAodGhpcy5zdGFydFBvaW50LnggLSB0aGlzLmVuZFBvaW50LngpIDogKHRoaXMuc3RhcnRQb2ludC55IC0gdGhpcy5lbmRQb2ludC55KTtcclxuICAgICAgICBpZih0aGlzLmRpciA9PT0gJ3J0bCcpIHtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gLW9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3RlcHBlZE9mZnNldCA9IE1hdGgucm91bmQob2Zmc2V0IC8gdGhpcy5ndXR0ZXJTdGVwKSAqIHRoaXMuZ3V0dGVyU3RlcDtcclxuICAgICAgICBcclxuICAgICAgICBpZihzdGVwcGVkT2Zmc2V0ID09PSB0aGlzLnNuYXBzaG90Lmxhc3RTdGVwcGVkT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zbmFwc2hvdC5sYXN0U3RlcHBlZE9mZnNldCA9IHN0ZXBwZWRPZmZzZXQ7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTmVlZCB0byBrbm93IGlmIGVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY291bGQgcmVhY3RzIHRvIHN0ZXBwZWRPZmZzZXRcclxuICAgICAgICBcclxuICAgICAgICBsZXQgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLXN0ZXBwZWRPZmZzZXQsIHRoaXMuc25hcHNob3QuYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgICAgIGxldCBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSh0aGlzLnVuaXQsIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciwgc3RlcHBlZE9mZnNldCwgdGhpcy5zbmFwc2hvdC5hbGxBcmVhc1NpemVQaXhlbCk7XHJcblxyXG4gICAgICAgIC8vIEVhY2ggZ3V0dGVyIHNpZGUgYXJlYXMgY2FuJ3QgYWJzb3JiIGFsbCBvZmZzZXQgXHJcbiAgICAgICAgaWYoYXJlYXNCZWZvcmUucmVtYWluICE9PSAwICYmIGFyZWFzQWZ0ZXIucmVtYWluICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmKE1hdGguYWJzKGFyZWFzQmVmb3JlLnJlbWFpbikgPT09IE1hdGguYWJzKGFyZWFzQWZ0ZXIucmVtYWluKSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoTWF0aC5hYnMoYXJlYXNCZWZvcmUucmVtYWluKSA+IE1hdGguYWJzKGFyZWFzQWZ0ZXIucmVtYWluKSkge1xyXG4gICAgICAgICAgICAgICAgYXJlYXNBZnRlciA9IGdldEd1dHRlclNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkodGhpcy51bml0LCB0aGlzLnNuYXBzaG90LmFyZWFzQWZ0ZXJHdXR0ZXIsIHN0ZXBwZWRPZmZzZXQgKyBhcmVhc0JlZm9yZS5yZW1haW4sIHRoaXMuc25hcHNob3QuYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLCB0aGlzLnNuYXBzaG90LmFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBcmVhcyBiZWZvcmUgZ3V0dGVyIGNhbid0IGFic29yYnMgYWxsIG9mZnNldCA+IG5lZWQgdG8gcmVjYWxjdWxhdGUgc2l6ZXMgZm9yIGFyZWFzIGFmdGVyIGd1dHRlci5cclxuICAgICAgICBlbHNlIGlmKGFyZWFzQmVmb3JlLnJlbWFpbiAhPT0gMCkge1xyXG4gICAgICAgICAgICBhcmVhc0FmdGVyID0gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSh0aGlzLnVuaXQsIHRoaXMuc25hcHNob3QuYXJlYXNBZnRlckd1dHRlciwgc3RlcHBlZE9mZnNldCArIGFyZWFzQmVmb3JlLnJlbWFpbiwgdGhpcy5zbmFwc2hvdC5hbGxBcmVhc1NpemVQaXhlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEFyZWFzIGFmdGVyIGd1dHRlciBjYW4ndCBhYnNvcmJzIGFsbCBvZmZzZXQgPiBuZWVkIHRvIHJlY2FsY3VsYXRlIHNpemVzIGZvciBhcmVhcyBiZWZvcmUgZ3V0dGVyLlxyXG4gICAgICAgIGVsc2UgaWYoYXJlYXNBZnRlci5yZW1haW4gIT09IDApIHtcclxuICAgICAgICAgICAgYXJlYXNCZWZvcmUgPSBnZXRHdXR0ZXJTaWRlQWJzb3JwdGlvbkNhcGFjaXR5KHRoaXMudW5pdCwgdGhpcy5zbmFwc2hvdC5hcmVhc0JlZm9yZUd1dHRlciwgLShzdGVwcGVkT2Zmc2V0IC0gYXJlYXNBZnRlci5yZW1haW4pLCB0aGlzLnNuYXBzaG90LmFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMudW5pdCA9PT0gJ3BlcmNlbnQnKSB7XHJcbiAgICAgICAgICAgIC8vIEhhY2sgYmVjYXVzZSBvZiBicm93c2VyIG1lc3NpbmcgdXAgd2l0aCBzaXplcyB1c2luZyBjYWxjKFglIC0gWXB4KSAtPiBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxyXG4gICAgICAgICAgICAvLyBJZiBub3QgdGhlcmUsIHBsYXlpbmcgd2l0aCBndXR0ZXJzIG1ha2VzIHRvdGFsIGdvaW5nIGRvd24gdG8gOTkuOTk4NzUlIHRoZW4gOTkuOTkyODYlLCA5OS45ODk4NiUsLi5cclxuICAgICAgICAgICAgY29uc3QgYWxsID0gWy4uLmFyZWFzQmVmb3JlLmxpc3QsIC4uLmFyZWFzQWZ0ZXIubGlzdF07XHJcbiAgICAgICAgICAgIGNvbnN0IGFyZWFUb1Jlc2V0ID0gYWxsLmZpbmQoYSA9PiBhLnBlcmNlbnRBZnRlckFic29ycHRpb24gIT09IDAgJiYgYS5wZXJjZW50QWZ0ZXJBYnNvcnB0aW9uICE9PSBhLmFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgJiYgYS5wZXJjZW50QWZ0ZXJBYnNvcnB0aW9uICE9PSBhLmFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUpXHJcblxyXG4gICAgICAgICAgICBpZihhcmVhVG9SZXNldCkge1xyXG4gICAgICAgICAgICAgICAgYXJlYVRvUmVzZXQucGVyY2VudEFmdGVyQWJzb3JwdGlvbiA9IHRoaXMuc25hcHNob3QuYWxsSW52b2x2ZWRBcmVhc1NpemVQZXJjZW50IC0gYWxsLmZpbHRlcihhID0+IGEgIT09IGFyZWFUb1Jlc2V0KS5yZWR1Y2UoKHRvdGFsLCBhKSA9PiB0b3RhbCthLnBlcmNlbnRBZnRlckFic29ycHRpb24sIDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBOb3cgd2Uga25vdyBhcmVhcyBjb3VsZCBhYnNvcmIgc3RlcHBlZE9mZnNldCwgdGltZSB0byByZWFsbHkgdXBkYXRlIHNpemVzXHJcbiAgICAgICAgXHJcbiAgICAgICAgYXJlYXNCZWZvcmUubGlzdC5mb3JFYWNoKGl0ZW0gPT4gdXBkYXRlQXJlYVNpemUodGhpcy51bml0LCBpdGVtKSk7XHJcbiAgICAgICAgYXJlYXNBZnRlci5saXN0LmZvckVhY2goaXRlbSA9PiB1cGRhdGVBcmVhU2l6ZSh0aGlzLnVuaXQsIGl0ZW0pKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnJlZnJlc2hTdHlsZVNpemVzKCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZnkoJ3Byb2dyZXNzJywgdGhpcy5zbmFwc2hvdC5ndXR0ZXJOdW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RvcERyYWdnaW5nKGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBpZihldmVudCkge1xyXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodGhpcy5pc0RyYWdnaW5nID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZGlzcGxheWVkQXJlYXMuZm9yRWFjaChhcmVhID0+IGFyZWEuY29tcG9uZW50LnVubG9ja0V2ZW50cygpKTtcclxuICAgICAgICBcclxuICAgICAgICB3aGlsZSh0aGlzLmRyYWdMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBmY3QgPSB0aGlzLmRyYWdMaXN0ZW5lcnMucG9wKCk7XHJcbiAgICAgICAgICAgIGlmKGZjdCkgZmN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFdhcm5pbmc6IEhhdmUgdG8gYmUgYmVmb3JlIFwibm90aWZ5KCdlbmQnKVwiIFxyXG4gICAgICAgIC8vIGJlY2F1c2UgXCJub3RpZnkoJ2VuZCcpXCJcIiBjYW4gYmUgbGlua2VkIHRvIFwiW3NpemVdPSd4J1wiID4gXCJidWlsZCgpXCIgPiBcInN0b3BEcmFnZ2luZygpXCJcclxuICAgICAgICB0aGlzLmlzRHJhZ2dpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gSWYgbW92ZWQgZnJvbSBzdGFydGluZyBwb2ludCwgbm90aWZ5IGVuZFxyXG4gICAgICAgIGlmKHRoaXMuZW5kUG9pbnQgJiYgKHRoaXMuc3RhcnRQb2ludC54ICE9PSB0aGlzLmVuZFBvaW50LnggfHwgdGhpcy5zdGFydFBvaW50LnkgIT09IHRoaXMuZW5kUG9pbnQueSkpIHtcclxuICAgICAgICAgICAgdGhpcy5ub3RpZnkoJ2VuZCcsIHRoaXMuc25hcHNob3QuZ3V0dGVyTnVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1kcmFnZ2luZycpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5ndXR0ZXJFbHMudG9BcnJheSgpW3RoaXMuc25hcHNob3QuZ3V0dGVyTnVtIC0gMV0ubmF0aXZlRWxlbWVudCwgJ2FzLWRyYWdnZWQnKTtcclxuICAgICAgICB0aGlzLnNuYXBzaG90ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmlzV2FpdGluZ0NsZWFyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gTmVlZGVkIHRvIGxldCAoY2xpY2spPVwiY2xpY2tHdXR0ZXIoLi4uKVwiIGV2ZW50IHJ1biBhbmQgdmVyaWZ5IGlmIG1vdXNlIG1vdmVkIG9yIG5vdFxyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0UG9pbnQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzV2FpdGluZ0NsZWFyID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5vdGlmeSh0eXBlOiAnc3RhcnQnIHwgJ3Byb2dyZXNzJyB8ICdlbmQnIHwgJ2NsaWNrJyB8ICdkYmxjbGljaycgfCAndHJhbnNpdGlvbkVuZCcsIGd1dHRlck51bTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc2l6ZXMgPSB0aGlzLmdldFZpc2libGVBcmVhU2l6ZXMoKTtcclxuXHJcbiAgICAgICAgaWYodHlwZSA9PT0gJ3N0YXJ0Jykge1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydC5lbWl0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ2VuZCcpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmFnRW5kLmVtaXQoe2d1dHRlck51bSwgc2l6ZXN9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0eXBlID09PSAnY2xpY2snKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3V0dGVyQ2xpY2suZW1pdCh7Z3V0dGVyTnVtLCBzaXplc30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGUgPT09ICdkYmxjbGljaycpIHtcclxuICAgICAgICAgICAgdGhpcy5ndXR0ZXJEYmxDbGljay5lbWl0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYodHlwZSA9PT0gJ3RyYW5zaXRpb25FbmQnKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudHJhbnNpdGlvbkVuZFN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB0aGlzLnRyYW5zaXRpb25FbmRTdWJzY3JpYmVyLm5leHQoc2l6ZXMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKHR5cGUgPT09ICdwcm9ncmVzcycpIHtcclxuICAgICAgICAgICAgLy8gU3RheSBvdXRzaWRlIHpvbmUgdG8gYWxsb3cgdXNlcnMgZG8gd2hhdCB0aGV5IHdhbnQgYWJvdXQgY2hhbmdlIGRldGVjdGlvbiBtZWNoYW5pc20uXHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ1Byb2dyZXNzU3ViamVjdC5uZXh0KHtndXR0ZXJOdW0sIHNpemVzfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0b3BEcmFnZ2luZygpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==