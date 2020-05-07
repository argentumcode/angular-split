/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Input, ElementRef, Renderer2, NgZone } from '@angular/core';
import { SplitComponent } from '../component/split.component';
import { getInputPositiveNumber, getInputBoolean } from '../utils';
export class SplitAreaDirective {
    /**
     * @param {?} ngZone
     * @param {?} elRef
     * @param {?} renderer
     * @param {?} split
     */
    constructor(ngZone, elRef, renderer, split) {
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
    /**
     * @param {?} v
     * @return {?}
     */
    set order(v) {
        this._order = getInputPositiveNumber(v, null);
        this.split.updateArea(this, true, false);
    }
    /**
     * @return {?}
     */
    get order() {
        return this._order;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set size(v) {
        this._size = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get size() {
        return this._size;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set minSize(v) {
        this._minSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get minSize() {
        return this._minSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set maxSize(v) {
        this._maxSize = getInputPositiveNumber(v, null);
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get maxSize() {
        return this._maxSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set lockSize(v) {
        this._lockSize = getInputBoolean(v);
        this.split.updateArea(this, false, true);
    }
    /**
     * @return {?}
     */
    get lockSize() {
        return this._lockSize;
    }
    /**
     * @param {?} v
     * @return {?}
     */
    set visible(v) {
        this._visible = getInputBoolean(v);
        if (this._visible) {
            this.split.showArea(this);
            this.renderer.removeClass(this.elRef.nativeElement, 'as-hidden');
        }
        else {
            this.split.hideArea(this);
            this.renderer.addClass(this.elRef.nativeElement, 'as-hidden');
        }
    }
    /**
     * @return {?}
     */
    get visible() {
        return this._visible;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.split.addArea(this);
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.transitionListener = this.renderer.listen(this.elRef.nativeElement, 'transitionend', (/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                // Limit only flex-basis transition to trigger the event
                if (event.propertyName === 'flex-basis') {
                    this.split.notify('transitionEnd', -1);
                }
            }));
        }));
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setStyleOrder(value) {
        this.renderer.setStyle(this.elRef.nativeElement, 'order', value);
    }
    /**
     * @param {?} grow
     * @param {?} shrink
     * @param {?} basis
     * @param {?} isMin
     * @param {?} isMax
     * @return {?}
     */
    setStyleFlex(grow, shrink, basis, isMin, isMax) {
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
    }
    /**
     * @return {?}
     */
    lockEvents() {
        this.ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => {
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'selectstart', (/**
             * @param {?} e
             * @return {?}
             */
            (e) => false)));
            this.lockListeners.push(this.renderer.listen(this.elRef.nativeElement, 'dragstart', (/**
             * @param {?} e
             * @return {?}
             */
            (e) => false)));
        }));
    }
    /**
     * @return {?}
     */
    unlockEvents() {
        while (this.lockListeners.length > 0) {
            /** @type {?} */
            const fct = this.lockListeners.pop();
            if (fct)
                fct();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unlockEvents();
        if (this.transitionListener) {
            this.transitionListener();
        }
        this.split.removeArea(this);
    }
}
SplitAreaDirective.decorators = [
    { type: Directive, args: [{
                selector: 'as-split-area, [as-split-area]',
                exportAs: 'asSplitArea'
            },] }
];
/** @nocollapse */
SplitAreaDirective.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: Renderer2 },
    { type: SplitComponent }
];
SplitAreaDirective.propDecorators = {
    order: [{ type: Input }],
    size: [{ type: Input }],
    minSize: [{ type: Input }],
    maxSize: [{ type: Input }],
    lockSize: [{ type: Input }],
    visible: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._order;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._size;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._minSize;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._maxSize;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._lockSize;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype._visible;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype.transitionListener;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype.lockListeners;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype.ngZone;
    /** @type {?} */
    SplitAreaDirective.prototype.elRef;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype.renderer;
    /**
     * @type {?}
     * @private
     */
    SplitAreaDirective.prototype.split;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRBcmVhLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItc3BsaXQvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlL3NwbGl0QXJlYS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQU1uRSxNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7O0lBZ0czQixZQUFvQixNQUFjLEVBQ2YsS0FBaUIsRUFDaEIsUUFBbUIsRUFDbkIsS0FBcUI7UUFIckIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNmLFVBQUssR0FBTCxLQUFLLENBQVk7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQWpHakMsV0FBTSxHQUFrQixJQUFJLENBQUM7O1FBYzdCLFVBQUssR0FBa0IsSUFBSSxDQUFDOztRQWM1QixhQUFRLEdBQWtCLElBQUksQ0FBQzs7UUFjL0IsYUFBUSxHQUFrQixJQUFJLENBQUM7O1FBYy9CLGNBQVMsR0FBWSxLQUFLLENBQUM7O1FBYzNCLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFzQmhCLGtCQUFhLEdBQW9CLEVBQUUsQ0FBQztRQU1qRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN0RSxDQUFDOzs7OztJQWpHRCxJQUFhLEtBQUssQ0FBQyxDQUFnQjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FB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LEVBQUUsYUFBYTthQUMxQjs7OztZQVJvRSxNQUFNO1lBQWhELFVBQVU7WUFBRSxTQUFTO1lBRXZDLGNBQWM7OztvQkFXbEIsS0FBSzttQkFjTCxLQUFLO3NCQWNMLEtBQUs7c0JBY0wsS0FBSzt1QkFjTCxLQUFLO3NCQWNMLEtBQUs7Ozs7Ozs7SUF4RU4sb0NBQXFDOzs7OztJQWNyQyxtQ0FBb0M7Ozs7O0lBY3BDLHNDQUF1Qzs7Ozs7SUFjdkMsc0NBQXVDOzs7OztJQWN2Qyx1Q0FBbUM7Ozs7O0lBY25DLHNDQUFpQzs7Ozs7SUFxQmpDLGdEQUFxQzs7Ozs7SUFDckMsMkNBQXFEOzs7OztJQUV6QyxvQ0FBc0I7O0lBQ3RCLG1DQUF3Qjs7Ozs7SUFDeEIsc0NBQTJCOzs7OztJQUMzQixtQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIE9uSW5pdCwgT25EZXN0cm95LCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFNwbGl0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50L3NwbGl0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGdldElucHV0UG9zaXRpdmVOdW1iZXIsIGdldElucHV0Qm9vbGVhbiB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdhcy1zcGxpdC1hcmVhLCBbYXMtc3BsaXQtYXJlYV0nLFxyXG4gICAgZXhwb3J0QXM6ICdhc1NwbGl0QXJlYSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNwbGl0QXJlYURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgICBwcml2YXRlIF9vcmRlcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IG9yZGVyKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9vcmRlciA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgbnVsbCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3BsaXQudXBkYXRlQXJlYSh0aGlzLCB0cnVlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBvcmRlcigpOiBudW1iZXIgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3JkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX3NpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBzaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX21pblNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBtaW5TaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9taW5TaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1pblNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX21heFNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBtYXhTaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tYXhTaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1heFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX2xvY2tTaXplOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGxvY2tTaXplKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9sb2NrU2l6ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxvY2tTaXplKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NrU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfdmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IHZpc2libGUodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBnZXRJbnB1dEJvb2xlYW4odik7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Zpc2libGUpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuc3BsaXQuc2hvd0FyZWEodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtaGlkZGVuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNwbGl0LmhpZGVBcmVhKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLWhpZGRlbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uTGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2NrTGlzdGVuZXJzOiBBcnJheTxGdW5jdGlvbj4gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzcGxpdDogU3BsaXRDb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXNwbGl0LWFyZWEnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcGxpdC5hZGRBcmVhKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIChldmVudDogVHJhbnNpdGlvbkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCBvbmx5IGZsZXgtYmFzaXMgdHJhbnNpdGlvbiB0byB0cmlnZ2VyIHRoZSBldmVudFxyXG4gICAgICAgICAgICAgICAgaWYoZXZlbnQucHJvcGVydHlOYW1lID09PSAnZmxleC1iYXNpcycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGl0Lm5vdGlmeSgndHJhbnNpdGlvbkVuZCcsIC0xKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN0eWxlT3JkZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnb3JkZXInLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRTdHlsZUZsZXgoZ3JvdzogbnVtYmVyLCBzaHJpbms6IG51bWJlciwgYmFzaXM6IHN0cmluZywgaXNNaW46IGJvb2xlYW4sIGlzTWF4OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgLy8gTmVlZCAzIHNlcGFyYXRlZCBwcm9wZXJ0aWVzIHRvIHdvcmsgb24gSUUxMSAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvZmxleC1sYXlvdXQvaXNzdWVzLzMyMylcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2ZsZXgtZ3JvdycsIGdyb3cpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1zaHJpbmsnLCBzaHJpbmspO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1iYXNpcycsIGJhc2lzKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihpc01pbiA9PT0gdHJ1ZSkgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtbWluJyk7XHJcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLW1pbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGlzTWF4ID09PSB0cnVlKSAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1tYXgnKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtbWF4Jyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBsb2NrRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ3NlbGVjdHN0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSkgKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2RyYWdzdGFydCcsIChlOiBFdmVudCkgPT4gZmFsc2UpICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVubG9ja0V2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB3aGlsZSh0aGlzLmxvY2tMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBmY3QgPSB0aGlzLmxvY2tMaXN0ZW5lcnMucG9wKCk7XHJcbiAgICAgICAgICAgIGlmKGZjdCkgZmN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnVubG9ja0V2ZW50cygpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnRyYW5zaXRpb25MaXN0ZW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC5yZW1vdmVBcmVhKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==