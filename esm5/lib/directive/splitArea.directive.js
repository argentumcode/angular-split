/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Input, ElementRef, Renderer2, NgZone } from '@angular/core';
import { SplitComponent } from '../component/split.component';
import { getInputPositiveNumber, getInputBoolean } from '../utils';
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
        { type: Directive, args: [{
                    selector: 'as-split-area, [as-split-area]',
                    exportAs: 'asSplitArea'
                },] }
    ];
    /** @nocollapse */
    SplitAreaDirective.ctorParameters = function () { return [
        { type: NgZone },
        { type: ElementRef },
        { type: Renderer2 },
        { type: SplitComponent }
    ]; };
    SplitAreaDirective.propDecorators = {
        order: [{ type: Input }],
        size: [{ type: Input }],
        minSize: [{ type: Input }],
        maxSize: [{ type: Input }],
        lockSize: [{ type: Input }],
        visible: [{ type: Input }]
    };
    return SplitAreaDirective;
}());
export { SplitAreaDirective };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BsaXRBcmVhLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItc3BsaXQvIiwic291cmNlcyI6WyJsaWIvZGlyZWN0aXZlL3NwbGl0QXJlYS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQXFCLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUVuRyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVuRTtJQW9HSSw0QkFBb0IsTUFBYyxFQUNmLEtBQWlCLEVBQ2hCLFFBQW1CLEVBQ25CLEtBQXFCO1FBSHJCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZixVQUFLLEdBQUwsS0FBSyxDQUFZO1FBQ2hCLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFqR2pDLFdBQU0sR0FBa0IsSUFBSSxDQUFDOztRQWM3QixVQUFLLEdBQWtCLElBQUksQ0FBQzs7UUFjNUIsYUFBUSxHQUFrQixJQUFJLENBQUM7O1FBYy9CLGFBQVEsR0FBa0IsSUFBSSxDQUFDOztRQWMvQixjQUFTLEdBQVksS0FBSyxDQUFDOztRQWMzQixhQUFRLEdBQVksSUFBSSxDQUFDO1FBc0JoQixrQkFBYSxHQUFvQixFQUFFLENBQUM7UUFNakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQWpHRCxzQkFBYSxxQ0FBSzs7OztRQU1sQjtZQUNJLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN2QixDQUFDOzs7OztRQVJELFVBQW1CLENBQWdCO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcs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QUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7O2dCQS9KSixTQUFTLFNBQUM7b0JBQ1AsUUFBUSxFQUFFLGdDQUFnQztvQkFDMUMsUUFBUSxFQUFFLGFBQWE7aUJBQzFCOzs7O2dCQVJvRSxNQUFNO2dCQUFoRCxVQUFVO2dCQUFFLFNBQVM7Z0JBRXZDLGNBQWM7Ozt3QkFXbEIsS0FBSzt1QkFjTCxLQUFLOzBCQWNMLEtBQUs7MEJBY0wsS0FBSzsyQkFjTCxLQUFLOzBCQWNMLEtBQUs7O0lBa0ZWLHlCQUFDO0NBQUEsQUFoS0QsSUFnS0M7U0E1Slksa0JBQWtCOzs7Ozs7SUFFM0Isb0NBQXFDOzs7OztJQWNyQyxtQ0FBb0M7Ozs7O0lBY3BDLHNDQUF1Qzs7Ozs7SUFjdkMsc0NBQXVDOzs7OztJQWN2Qyx1Q0FBbUM7Ozs7O0lBY25DLHNDQUFpQzs7Ozs7SUFxQmpDLGdEQUFxQzs7Ozs7SUFDckMsMkNBQXFEOzs7OztJQUV6QyxvQ0FBc0I7O0lBQ3RCLG1DQUF3Qjs7Ozs7SUFDeEIsc0NBQTJCOzs7OztJQUMzQixtQ0FBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIElucHV0LCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIE9uSW5pdCwgT25EZXN0cm95LCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFNwbGl0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50L3NwbGl0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IGdldElucHV0UG9zaXRpdmVOdW1iZXIsIGdldElucHV0Qm9vbGVhbiB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6ICdhcy1zcGxpdC1hcmVhLCBbYXMtc3BsaXQtYXJlYV0nLFxyXG4gICAgZXhwb3J0QXM6ICdhc1NwbGl0QXJlYSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNwbGl0QXJlYURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuXHJcbiAgICBwcml2YXRlIF9vcmRlcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IG9yZGVyKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9vcmRlciA9IGdldElucHV0UG9zaXRpdmVOdW1iZXIodiwgbnVsbCk7XHJcblxyXG4gICAgICAgIHRoaXMuc3BsaXQudXBkYXRlQXJlYSh0aGlzLCB0cnVlLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBvcmRlcigpOiBudW1iZXIgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3JkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX3NpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBzaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IHNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX21pblNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBtaW5TaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9taW5TaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1pblNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21pblNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX21heFNpemU6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBJbnB1dCgpIHNldCBtYXhTaXplKHY6IG51bWJlciB8IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9tYXhTaXplID0gZ2V0SW5wdXRQb3NpdGl2ZU51bWJlcih2LCBudWxsKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IG1heFNpemUoKTogbnVtYmVyIHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21heFNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vL1xyXG5cclxuICAgIHByaXZhdGUgX2xvY2tTaXplOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IGxvY2tTaXplKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9sb2NrU2l6ZSA9IGdldElucHV0Qm9vbGVhbih2KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC51cGRhdGVBcmVhKHRoaXMsIGZhbHNlLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0IGxvY2tTaXplKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2NrU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSBfdmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQElucHV0KCkgc2V0IHZpc2libGUodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSBnZXRJbnB1dEJvb2xlYW4odik7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3Zpc2libGUpIHsgXHJcbiAgICAgICAgICAgIHRoaXMuc3BsaXQuc2hvd0FyZWEodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtaGlkZGVuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNwbGl0LmhpZGVBcmVhKHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLWhpZGRlbicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vXHJcblxyXG4gICAgcHJpdmF0ZSB0cmFuc2l0aW9uTGlzdGVuZXI6IEZ1bmN0aW9uO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2NrTGlzdGVuZXJzOiBBcnJheTxGdW5jdGlvbj4gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLFxyXG4gICAgICAgICAgICAgICAgcHVibGljIGVsUmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzcGxpdDogU3BsaXRDb21wb25lbnQpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLXNwbGl0LWFyZWEnKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zcGxpdC5hZGRBcmVhKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbkxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIChldmVudDogVHJhbnNpdGlvbkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBMaW1pdCBvbmx5IGZsZXgtYmFzaXMgdHJhbnNpdGlvbiB0byB0cmlnZ2VyIHRoZSBldmVudFxyXG4gICAgICAgICAgICAgICAgaWYoZXZlbnQucHJvcGVydHlOYW1lID09PSAnZmxleC1iYXNpcycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGl0Lm5vdGlmeSgndHJhbnNpdGlvbkVuZCcsIC0xKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN0eWxlT3JkZXIodmFsdWU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnb3JkZXInLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzZXRTdHlsZUZsZXgoZ3JvdzogbnVtYmVyLCBzaHJpbms6IG51bWJlciwgYmFzaXM6IHN0cmluZywgaXNNaW46IGJvb2xlYW4sIGlzTWF4OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgLy8gTmVlZCAzIHNlcGFyYXRlZCBwcm9wZXJ0aWVzIHRvIHdvcmsgb24gSUUxMSAoaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvZmxleC1sYXlvdXQvaXNzdWVzLzMyMylcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2ZsZXgtZ3JvdycsIGdyb3cpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1zaHJpbmsnLCBzaHJpbmspO1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnZmxleC1iYXNpcycsIGJhc2lzKTtcclxuICAgICAgICBcclxuICAgICAgICBpZihpc01pbiA9PT0gdHJ1ZSkgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtbWluJyk7XHJcbiAgICAgICAgZWxzZSAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2FzLW1pbicpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmKGlzTWF4ID09PSB0cnVlKSAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsICdhcy1tYXgnKTtcclxuICAgICAgICBlbHNlICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbFJlZi5uYXRpdmVFbGVtZW50LCAnYXMtbWF4Jyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBsb2NrRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ3NlbGVjdHN0YXJ0JywgKGU6IEV2ZW50KSA9PiBmYWxzZSkgKTtcclxuICAgICAgICAgICAgdGhpcy5sb2NrTGlzdGVuZXJzLnB1c2goIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZWxSZWYubmF0aXZlRWxlbWVudCwgJ2RyYWdzdGFydCcsIChlOiBFdmVudCkgPT4gZmFsc2UpICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVubG9ja0V2ZW50cygpOiB2b2lkIHtcclxuICAgICAgICB3aGlsZSh0aGlzLmxvY2tMaXN0ZW5lcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBmY3QgPSB0aGlzLmxvY2tMaXN0ZW5lcnMucG9wKCk7XHJcbiAgICAgICAgICAgIGlmKGZjdCkgZmN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnVubG9ja0V2ZW50cygpO1xyXG5cclxuICAgICAgICBpZih0aGlzLnRyYW5zaXRpb25MaXN0ZW5lcikge1xyXG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MaXN0ZW5lcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zcGxpdC5yZW1vdmVBcmVhKHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==