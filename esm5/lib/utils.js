/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} event
 * @return {?}
 */
export function getPointFromEvent(event) {
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
export function getElementPixelSize(elRef, direction) {
    /** @type {?} */
    var rect = ((/** @type {?} */ (elRef.nativeElement))).getBoundingClientRect();
    return (direction === 'horizontal') ? rect.width : rect.height;
}
/**
 * @param {?} v
 * @return {?}
 */
export function getInputBoolean(v) {
    return (typeof (v) === 'boolean') ? v : (v === 'false' ? false : true);
}
/**
 * @template T
 * @param {?} v
 * @param {?} defaultValue
 * @return {?}
 */
export function getInputPositiveNumber(v, defaultValue) {
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
export function isUserSizesValid(unit, sizes) {
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
export function getAreaMinSize(a) {
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
export function getAreaMaxSize(a) {
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
export function getGutterSideAbsorptionCapacity(unit, sideAreas, pixels, allAreasSizePixel) {
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
        return getAreaAbsorptionCapacityPixel(areaSnapshot, pixels, allAreasSizePixel);
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
export function updateAreaSize(unit, item) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLXNwbGl0LyIsInNvdXJjZXMiOlsibGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBSUEsTUFBTSxVQUFVLGlCQUFpQixDQUFDLEtBQThCO0lBQzVELGFBQWE7SUFDYixJQUFHLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxjQUFjLEtBQUssU0FBUyxJQUFJLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNwRyxPQUFPO1lBQ0gsQ0FBQyxFQUFFLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUNqRCxDQUFDLEVBQUUsQ0FBQyxtQkFBYSxLQUFLLEVBQUEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPO1NBQ3BELENBQUM7S0FDTDtJQUNELGFBQWE7U0FDUixJQUFHLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO1FBQzlGLE9BQU87WUFDSCxDQUFDLEVBQUUsQ0FBQyxtQkFBYSxLQUFLLEVBQUEsQ0FBQyxDQUFDLE9BQU87WUFDL0IsQ0FBQyxFQUFFLENBQUMsbUJBQWEsS0FBSyxFQUFBLENBQUMsQ0FBQyxPQUFPO1NBQ2xDLENBQUM7S0FDTDtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxtQkFBbUIsQ0FBQyxLQUFpQixFQUFFLFNBQW9DOztRQUNqRixJQUFJLEdBQUcsQ0FBQyxtQkFBYyxLQUFLLENBQUMsYUFBYSxFQUFBLENBQUMsQ0FBQyxxQkFBcUIsRUFBRTtJQUV4RSxPQUFPLENBQUMsU0FBUyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ25FLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxDQUFNO0lBQ2xDLE9BQU8sQ0FBQyxPQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFFLENBQUM7Ozs7Ozs7QUFFRCxNQUFNLFVBQVUsc0JBQXNCLENBQUksQ0FBTSxFQUFFLFlBQWU7SUFDN0QsSUFBRyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTO1FBQUUsT0FBTyxZQUFZLENBQUM7SUFFdEQsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNkLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDbEQsQ0FBQzs7Ozs7O0FBRUQsTUFBTSxVQUFVLGdCQUFnQixDQUFDLElBQXlCLEVBQUUsS0FBMkI7SUFDbkYsd0RBQXdEO0lBQ3hELElBQUcsSUFBSSxLQUFLLFNBQVMsRUFBRTs7WUFDYixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU07Ozs7O1FBQUMsVUFBQyxLQUFLLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUE5QixDQUE4QixHQUFFLENBQUMsQ0FBQztRQUMzRSxPQUFPLEtBQUssQ0FBQyxLQUFLOzs7O1FBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsRUFBQyxJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztLQUN4RTtJQUVELDRDQUE0QztJQUM1QyxJQUFHLElBQUksS0FBSyxPQUFPLEVBQUU7UUFDakIsT0FBTyxLQUFLLENBQUMsTUFBTTs7OztRQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxLQUFLLElBQUksRUFBVixDQUFVLEVBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQ3JEO0FBQ0wsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLENBQVE7SUFDbkMsSUFBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtRQUNoQixPQUFPLElBQUksQ0FBQztLQUNmO0lBRUQsSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDOUIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ2pCO0lBRUQsSUFBRyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sS0FBSyxJQUFJLEVBQUU7UUFDN0IsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtRQUM3QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDakI7SUFFRCxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO0FBQy9CLENBQUM7Ozs7O0FBRUQsTUFBTSxVQUFVLGNBQWMsQ0FBQyxDQUFRO0lBQ25DLElBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7UUFDaEIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUVELElBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO1FBQzlCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNqQjtJQUVELElBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFFO1FBQzdCLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFFRCxJQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUU7UUFDN0IsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ2pCO0lBRUQsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUMvQixDQUFDOzs7Ozs7OztBQUVELE1BQU0sVUFBVSwrQkFBK0IsQ0FBQyxJQUF5QixFQUFFLFNBQStCLEVBQUUsTUFBYyxFQUFFLGlCQUF5QjtJQUNqSixPQUFPLFNBQVMsQ0FBQyxNQUFNOzs7OztJQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7O1lBQ3hCLEdBQUcsR0FBRyx5QkFBeUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7UUFDaEYsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsR0FBRyxDQUFDLE1BQU0sR0FBSSxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQzlCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQyxHQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDOzs7Ozs7OztBQUVELFNBQVMseUJBQXlCLENBQUMsSUFBeUIsRUFBRSxZQUEyQixFQUFFLE1BQWMsRUFBRSxpQkFBeUI7SUFDaEksa0JBQWtCO0lBQ2xCLElBQUcsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNiLE9BQU87WUFDSCxZQUFZLGNBQUE7WUFDWixXQUFXLEVBQUUsQ0FBQztZQUNkLHNCQUFzQixFQUFFLFlBQVksQ0FBQyxrQkFBa0I7WUFDdkQsV0FBVyxFQUFFLENBQUM7U0FDakIsQ0FBQztLQUNMO0lBRUQsMERBQTBEO0lBQzFELElBQUcsWUFBWSxDQUFDLGdCQUFnQixLQUFLLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2xELE9BQU87WUFDSCxZQUFZLGNBQUE7WUFDWixXQUFXLEVBQUUsQ0FBQztZQUNkLHNCQUFzQixFQUFFLENBQUM7WUFDekIsV0FBVyxFQUFFLE1BQU07U0FDdEIsQ0FBQztLQUNMO0lBRUQsSUFBRyxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ25CLE9BQU8sZ0NBQWdDLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3BGO0lBRUosSUFBRyxJQUFJLEtBQUssT0FBTyxFQUFFO1FBQ2QsT0FBTyw4QkFBOEIsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixDQUFDLENBQUM7S0FDbEY7QUFDTCxDQUFDOzs7Ozs7O0FBRUQsU0FBUyxnQ0FBZ0MsQ0FBQyxZQUEyQixFQUFFLE1BQWMsRUFBRSxpQkFBeUI7O1FBQ3RHLGFBQWEsR0FBRyxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsTUFBTTs7UUFDdEQsZUFBZSxHQUFHLGFBQWEsR0FBRyxpQkFBaUIsR0FBRyxHQUFHO0lBRS9ELGVBQWU7SUFFZixJQUFHLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDWCxtRkFBbUY7UUFDbkYsSUFBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLElBQUksZUFBZSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOzs7Z0JBRTVFLFlBQVksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsaUJBQWlCO1lBQ3hFLE9BQU87Z0JBQ0gsWUFBWSxjQUFBO2dCQUNaLFdBQVcsRUFBRSxZQUFZO2dCQUN6QixzQkFBc0IsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQ2pELFdBQVcsRUFBRSxZQUFZLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxHQUFHLFlBQVk7YUFDckUsQ0FBQztTQUNMO1FBQ0QsT0FBTztZQUNILFlBQVksY0FBQTtZQUNaLFdBQVcsRUFBRSxNQUFNO1lBQ25CLHNCQUFzQixFQUFFLGVBQWUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZTtZQUNyRSxXQUFXLEVBQUUsQ0FBQztTQUNqQixDQUFDO0tBQ0w7SUFFRCxjQUFjO1NBRVQsSUFBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2hCLG9GQUFvRjtRQUNwRixJQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxlQUFlLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7OztnQkFFNUUsWUFBWSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxpQkFBaUI7WUFDeEUsT0FBTztnQkFDSCxZQUFZLGNBQUE7Z0JBQ1osV0FBVyxFQUFFLFlBQVk7Z0JBQ3pCLHNCQUFzQixFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTztnQkFDakQsV0FBVyxFQUFFLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLEdBQUcsWUFBWTthQUNyRSxDQUFDO1NBQ0w7UUFDRCxrREFBa0Q7YUFDN0MsSUFBRyxlQUFlLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLGdFQUFnRTtZQUNoRSxPQUFPO2dCQUNILFlBQVksY0FBQTtnQkFDWixXQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCO2dCQUMzQyxzQkFBc0IsRUFBRSxDQUFDO2dCQUN6QixXQUFXLEVBQUUsTUFBTSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0I7YUFDdEQsQ0FBQztTQUNMO1FBQ0QsT0FBTztZQUNILFlBQVksY0FBQTtZQUNaLFdBQVcsRUFBRSxNQUFNO1lBQ25CLHNCQUFzQixFQUFFLGVBQWU7WUFDdkMsV0FBVyxFQUFFLENBQUM7U0FDakIsQ0FBQztLQUNMO0FBQ0wsQ0FBQzs7Ozs7OztBQUVELFNBQVMsOEJBQThCLENBQUMsWUFBMkIsRUFBRSxNQUFjLEVBQUUsa0JBQTBCOztRQUNyRyxhQUFhLEdBQUcsWUFBWSxDQUFDLGdCQUFnQixHQUFHLE1BQU07SUFFNUQsZUFBZTtJQUVmLElBQUcsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNYLG1GQUFtRjtRQUNuRixJQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEYsT0FBTztnQkFDSCxZQUFZLGNBQUE7Z0JBQ1osV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxnQkFBZ0I7Z0JBQ3RFLHNCQUFzQixFQUFFLENBQUMsQ0FBQztnQkFDMUIsV0FBVyxFQUFFLGFBQWEsR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU87YUFDekQsQ0FBQztTQUNMO1FBQ0QsT0FBTztZQUNILFlBQVksY0FBQTtZQUNaLFdBQVcsRUFBRSxNQUFNO1lBQ25CLHNCQUFzQixFQUFFLENBQUMsQ0FBQztZQUMxQixXQUFXLEVBQUUsQ0FBQztTQUNqQixDQUFDO0tBQ0w7SUFFRCxjQUFjO1NBRVQsSUFBRyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2hCLG9GQUFvRjtRQUNwRixJQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxLQUFLLElBQUksSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEYsT0FBTztnQkFDSCxZQUFZLGNBQUE7Z0JBQ1osV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sR0FBRyxhQUFhO2dCQUMvRCxzQkFBc0IsRUFBRSxDQUFDLENBQUM7Z0JBQzFCLFdBQVcsRUFBRSxhQUFhLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPO2FBQ3pELENBQUM7U0FDTDtRQUNELGtEQUFrRDthQUM3QyxJQUFHLGFBQWEsR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTztnQkFDSCxZQUFZLGNBQUE7Z0JBQ1osV0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDLGdCQUFnQjtnQkFDM0Msc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQixXQUFXLEVBQUUsTUFBTSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0I7YUFDdEQsQ0FBQztTQUNMO1FBQ0QsT0FBTztZQUNILFlBQVksY0FBQTtZQUNaLFdBQVcsRUFBRSxNQUFNO1lBQ25CLHNCQUFzQixFQUFFLENBQUMsQ0FBQztZQUMxQixXQUFXLEVBQUUsQ0FBQztTQUNqQixDQUFDO0tBQ0w7QUFDTCxDQUFDOzs7Ozs7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLElBQXlCLEVBQUUsSUFBNkI7SUFFbkYsSUFBRyxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUM7S0FDN0Q7U0FDSSxJQUFHLElBQUksS0FBSyxPQUFPLEVBQUU7UUFDdEIsZ0RBQWdEO1FBQ2hELElBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtZQUNyQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3ZGO0tBQ0o7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgSUFyZWEsIElQb2ludCwgSUFyZWFTbmFwc2hvdCwgSVNwbGl0U2lkZUFic29ycHRpb25DYXBhY2l0eSwgSUFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkgfSBmcm9tICcuL2ludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9pbnRGcm9tRXZlbnQoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KTogSVBvaW50IHtcclxuICAgIC8vIFRvdWNoRXZlbnRcclxuICAgIGlmKCg8VG91Y2hFdmVudD4gZXZlbnQpLmNoYW5nZWRUb3VjaGVzICE9PSB1bmRlZmluZWQgJiYgKDxUb3VjaEV2ZW50PiBldmVudCkuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICg8VG91Y2hFdmVudD4gZXZlbnQpLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXHJcbiAgICAgICAgICAgIHk6ICg8VG91Y2hFdmVudD4gZXZlbnQpLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIC8vIE1vdXNlRXZlbnRcclxuICAgIGVsc2UgaWYoKDxNb3VzZUV2ZW50PiBldmVudCkuY2xpZW50WCAhPT0gdW5kZWZpbmVkICYmICg8TW91c2VFdmVudD4gZXZlbnQpLmNsaWVudFkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHg6ICg8TW91c2VFdmVudD4gZXZlbnQpLmNsaWVudFgsXHJcbiAgICAgICAgICAgIHk6ICg8TW91c2VFdmVudD4gZXZlbnQpLmNsaWVudFksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudFBpeGVsU2l6ZShlbFJlZjogRWxlbWVudFJlZiwgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHJlY3QgPSAoPEhUTUxFbGVtZW50PiBlbFJlZi5uYXRpdmVFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICByZXR1cm4gKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSA/IHJlY3Qud2lkdGggOiByZWN0LmhlaWdodDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0Qm9vbGVhbih2OiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAodHlwZW9mKHYpID09PSAnYm9vbGVhbicpID8gdiA6ICh2ID09PSAnZmFsc2UnID8gZmFsc2UgOiB0cnVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldElucHV0UG9zaXRpdmVOdW1iZXI8VD4odjogYW55LCBkZWZhdWx0VmFsdWU6IFQpOiBudW1iZXIgfCBUIHtcclxuICAgIGlmKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZGVmYXVsdFZhbHVlO1xyXG5cclxuICAgIHYgPSBOdW1iZXIodik7XHJcbiAgICByZXR1cm4gIWlzTmFOKHYpICYmIHYgPj0gMCA/IHYgOiBkZWZhdWx0VmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1VzZXJTaXplc1ZhbGlkKHVuaXQ6ICdwZXJjZW50JyB8ICdwaXhlbCcsIHNpemVzOiBBcnJheTxudW1iZXIgfCBudWxsPik6IGJvb2xlYW4ge1xyXG4gICAgLy8gQWxsIHNpemVzIGhhdmUgdG8gYmUgbm90IG51bGwgYW5kIHRvdGFsIHNob3VsZCBiZSAxMDBcclxuICAgIGlmKHVuaXQgPT09ICdwZXJjZW50Jykge1xyXG4gICAgICAgIGNvbnN0IHRvdGFsID0gc2l6ZXMucmVkdWNlKCh0b3RhbCwgcykgPT4gcyAhPT0gbnVsbCA/IHRvdGFsICsgcyA6IHRvdGFsLCAwKTtcclxuICAgICAgICByZXR1cm4gc2l6ZXMuZXZlcnkocyA9PiBzICE9PSBudWxsKSAmJiB0b3RhbCA+IDk5LjkgJiYgdG90YWwgPCAxMDAuMTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gQSBzaXplIGF0IG51bGwgaXMgbWFuZGF0b3J5IGJ1dCBvbmx5IG9uZS5cclxuICAgIGlmKHVuaXQgPT09ICdwaXhlbCcpIHtcclxuICAgICAgICByZXR1cm4gc2l6ZXMuZmlsdGVyKHMgPT4gcyA9PT0gbnVsbCkubGVuZ3RoID09PSAxO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJlYU1pblNpemUoYTogSUFyZWEpOiBudWxsIHwgbnVtYmVyIHtcclxuICAgIGlmKGEuc2l6ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihhLmNvbXBvbmVudC5sb2NrU2l6ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBhLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoYS5jb21wb25lbnQubWluU2l6ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGEuY29tcG9uZW50Lm1pblNpemUgPiBhLnNpemUpIHtcclxuICAgICAgICByZXR1cm4gYS5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhLmNvbXBvbmVudC5taW5TaXplO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXJlYU1heFNpemUoYTogSUFyZWEpOiBudWxsIHwgbnVtYmVyIHtcclxuICAgIGlmKGEuc2l6ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZihhLmNvbXBvbmVudC5sb2NrU2l6ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHJldHVybiBhLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoYS5jb21wb25lbnQubWF4U2l6ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGEuY29tcG9uZW50Lm1heFNpemUgPCBhLnNpemUpIHtcclxuICAgICAgICByZXR1cm4gYS5zaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhLmNvbXBvbmVudC5tYXhTaXplO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3V0dGVyU2lkZUFic29ycHRpb25DYXBhY2l0eSh1bml0OiAncGVyY2VudCcgfCAncGl4ZWwnLCBzaWRlQXJlYXM6IEFycmF5PElBcmVhU25hcHNob3Q+LCBwaXhlbHM6IG51bWJlciwgYWxsQXJlYXNTaXplUGl4ZWw6IG51bWJlcik6IElTcGxpdFNpZGVBYnNvcnB0aW9uQ2FwYWNpdHkge1xyXG4gICAgcmV0dXJuIHNpZGVBcmVhcy5yZWR1Y2UoKGFjYywgYXJlYSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlcyA9IGdldEFyZWFBYnNvcnB0aW9uQ2FwYWNpdHkodW5pdCwgYXJlYSwgYWNjLnJlbWFpbiwgYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgICAgIGFjYy5saXN0LnB1c2gocmVzKTtcclxuICAgICAgICBhY2MucmVtYWluICA9IHJlcy5waXhlbFJlbWFpbjtcclxuICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwge3JlbWFpbjogcGl4ZWxzLCBsaXN0OiBbXX0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5KHVuaXQ6ICdwZXJjZW50JyB8ICdwaXhlbCcsIGFyZWFTbmFwc2hvdDogSUFyZWFTbmFwc2hvdCwgcGl4ZWxzOiBudW1iZXIsIGFsbEFyZWFzU2l6ZVBpeGVsOiBudW1iZXIpOiBJQXJlYUFic29ycHRpb25DYXBhY2l0eSB7XHJcbiAgICAvLyBObyBwYWluIG5vIGdhaW5cclxuICAgIGlmKHBpeGVscyA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgICAgICAgcGl4ZWxBYnNvcmI6IDAsXHJcbiAgICAgICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IGFyZWFTbmFwc2hvdC5zaXplUGVyY2VudEF0U3RhcnQsXHJcbiAgICAgICAgICAgIHBpeGVsUmVtYWluOiAwLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEFyZWEgc3RhcnQgYXQgemVybyBhbmQgbmVlZCB0byBiZSByZWR1Y2VkLCBub3QgcG9zc2libGVcclxuICAgIGlmKGFyZWFTbmFwc2hvdC5zaXplUGl4ZWxBdFN0YXJ0ID09PSAwICYmIHBpeGVscyA8IDApIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgIHBpeGVsQWJzb3JiOiAwLFxyXG4gICAgICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAwLFxyXG4gICAgICAgICAgICBwaXhlbFJlbWFpbjogcGl4ZWxzLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmKHVuaXQgPT09ICdwZXJjZW50Jykge1xyXG4gICAgICAgIHJldHVybiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGVyY2VudChhcmVhU25hcHNob3QsIHBpeGVscywgYWxsQXJlYXNTaXplUGl4ZWwpO1xyXG4gICAgfVxyXG4gICAgXHJcblx0aWYodW5pdCA9PT0gJ3BpeGVsJykge1xyXG4gICAgICAgIHJldHVybiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGl4ZWwoYXJlYVNuYXBzaG90LCBwaXhlbHMsIGFsbEFyZWFzU2l6ZVBpeGVsKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QXJlYUFic29ycHRpb25DYXBhY2l0eVBlcmNlbnQoYXJlYVNuYXBzaG90OiBJQXJlYVNuYXBzaG90LCBwaXhlbHM6IG51bWJlciwgYWxsQXJlYXNTaXplUGl4ZWw6IG51bWJlcik6IElBcmVhQWJzb3JwdGlvbkNhcGFjaXR5IHtcclxuICAgIGNvbnN0IHRlbXBQaXhlbFNpemUgPSBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIHBpeGVscztcclxuICAgIGNvbnN0IHRlbXBQZXJjZW50U2l6ZSA9IHRlbXBQaXhlbFNpemUgLyBhbGxBcmVhc1NpemVQaXhlbCAqIDEwMDtcclxuICAgIFxyXG4gICAgLy8gRU5MQVJHRSBBUkVBXHJcbiAgICBcclxuICAgIGlmKHBpeGVscyA+IDApIHtcclxuICAgICAgICAvLyBJZiBtYXhTaXplICYgbmV3U2l6ZSBiaWdnZXIgdGhhbiBpdCA+IGFic29yYiB0byBtYXggYW5kIHJldHVybiByZW1haW5pbmcgcGl4ZWxzIFxyXG4gICAgICAgIGlmKGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUgIT09IG51bGwgJiYgdGVtcFBlcmNlbnRTaXplID4gYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAvLyBVc2UgYXJlYS5hcmVhLm1heFNpemUgYXMgbmV3UGVyY2VudFNpemUgYW5kIHJldHVybiBjYWxjdWxhdGUgcGl4ZWxzIHJlbWFpbmluZ1xyXG4gICAgICAgICAgICBjb25zdCBtYXhTaXplUGl4ZWwgPSBhcmVhU25hcHNob3QuYXJlYS5tYXhTaXplIC8gMTAwICogYWxsQXJlYXNTaXplUGl4ZWw7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgICAgICBwaXhlbEFic29yYjogbWF4U2l6ZVBpeGVsLFxyXG4gICAgICAgICAgICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSxcclxuICAgICAgICAgICAgICAgIHBpeGVsUmVtYWluOiBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIHBpeGVscyAtIG1heFNpemVQaXhlbFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgIHBpeGVsQWJzb3JiOiBwaXhlbHMsXHJcbiAgICAgICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IHRlbXBQZXJjZW50U2l6ZSA+IDEwMCA/IDEwMCA6IHRlbXBQZXJjZW50U2l6ZSxcclxuICAgICAgICAgICAgcGl4ZWxSZW1haW46IDBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJFRFVDRSBBUkVBXHJcbiAgICBcclxuICAgIGVsc2UgaWYocGl4ZWxzIDwgMCkge1xyXG4gICAgICAgIC8vIElmIG1pblNpemUgJiBuZXdTaXplIHNtYWxsZXIgdGhhbiBpdCA+IGFic29yYiB0byBtaW4gYW5kIHJldHVybiByZW1haW5pbmcgcGl4ZWxzIFxyXG4gICAgICAgIGlmKGFyZWFTbmFwc2hvdC5hcmVhLm1pblNpemUgIT09IG51bGwgJiYgdGVtcFBlcmNlbnRTaXplIDwgYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSkge1xyXG4gICAgICAgICAgICAvLyBVc2UgYXJlYS5hcmVhLm1pblNpemUgYXMgbmV3UGVyY2VudFNpemUgYW5kIHJldHVybiBjYWxjdWxhdGUgcGl4ZWxzIHJlbWFpbmluZ1xyXG4gICAgICAgICAgICBjb25zdCBtaW5TaXplUGl4ZWwgPSBhcmVhU25hcHNob3QuYXJlYS5taW5TaXplIC8gMTAwICogYWxsQXJlYXNTaXplUGl4ZWw7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgICAgICBwaXhlbEFic29yYjogbWluU2l6ZVBpeGVsLFxyXG4gICAgICAgICAgICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSxcclxuICAgICAgICAgICAgICAgIHBpeGVsUmVtYWluOiBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIHBpeGVscyAtIG1pblNpemVQaXhlbFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiByZWR1Y2VkIHVuZGVyIHplcm8gPiByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgICAgIGVsc2UgaWYodGVtcFBlcmNlbnRTaXplIDwgMCkge1xyXG4gICAgICAgICAgICAvLyBVc2UgMCBhcyBuZXdQZXJjZW50U2l6ZSBhbmQgcmV0dXJuIGNhbGN1bGF0ZSBwaXhlbHMgcmVtYWluaW5nXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgICAgICBwaXhlbEFic29yYjogLWFyZWFTbmFwc2hvdC5zaXplUGl4ZWxBdFN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIHBpeGVsUmVtYWluOiBwaXhlbHMgKyBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgIHBpeGVsQWJzb3JiOiBwaXhlbHMsXHJcbiAgICAgICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IHRlbXBQZXJjZW50U2l6ZSxcclxuICAgICAgICAgICAgcGl4ZWxSZW1haW46IDBcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRBcmVhQWJzb3JwdGlvbkNhcGFjaXR5UGl4ZWwoYXJlYVNuYXBzaG90OiBJQXJlYVNuYXBzaG90LCBwaXhlbHM6IG51bWJlciwgY29udGFpbmVyU2l6ZVBpeGVsOiBudW1iZXIpOiBJQXJlYUFic29ycHRpb25DYXBhY2l0eSB7XHJcbiAgICBjb25zdCB0ZW1wUGl4ZWxTaXplID0gYXJlYVNuYXBzaG90LnNpemVQaXhlbEF0U3RhcnQgKyBwaXhlbHM7XHJcbiAgICAgICAgICAgIFxyXG4gICAgLy8gRU5MQVJHRSBBUkVBXHJcblxyXG4gICAgaWYocGl4ZWxzID4gMCkge1xyXG4gICAgICAgIC8vIElmIG1heFNpemUgJiBuZXdTaXplIGJpZ2dlciB0aGFuIGl0ID4gYWJzb3JiIHRvIG1heCBhbmQgcmV0dXJuIHJlbWFpbmluZyBwaXhlbHMgXHJcbiAgICAgICAgaWYoYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSAhPT0gbnVsbCAmJiB0ZW1wUGl4ZWxTaXplID4gYXJlYVNuYXBzaG90LmFyZWEubWF4U2l6ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYXJlYVNuYXBzaG90LFxyXG4gICAgICAgICAgICAgICAgcGl4ZWxBYnNvcmI6IGFyZWFTbmFwc2hvdC5hcmVhLm1heFNpemUgLSBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCxcclxuICAgICAgICAgICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IC0xLFxyXG4gICAgICAgICAgICAgICAgcGl4ZWxSZW1haW46IHRlbXBQaXhlbFNpemUgLSBhcmVhU25hcHNob3QuYXJlYS5tYXhTaXplXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgICAgICAgcGl4ZWxBYnNvcmI6IHBpeGVscyxcclxuICAgICAgICAgICAgcGVyY2VudEFmdGVyQWJzb3JwdGlvbjogLTEsXHJcbiAgICAgICAgICAgIHBpeGVsUmVtYWluOiAwXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSRURVQ0UgQVJFQVxyXG4gICAgXHJcbiAgICBlbHNlIGlmKHBpeGVscyA8IDApIHtcclxuICAgICAgICAvLyBJZiBtaW5TaXplICYgbmV3U2l6ZSBzbWFsbGVyIHRoYW4gaXQgPiBhYnNvcmIgdG8gbWluIGFuZCByZXR1cm4gcmVtYWluaW5nIHBpeGVscyBcclxuICAgICAgICBpZihhcmVhU25hcHNob3QuYXJlYS5taW5TaXplICE9PSBudWxsICYmIHRlbXBQaXhlbFNpemUgPCBhcmVhU25hcHNob3QuYXJlYS5taW5TaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgICAgICBwaXhlbEFic29yYjogYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZSArIHBpeGVscyAtIHRlbXBQaXhlbFNpemUsXHJcbiAgICAgICAgICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAtMSxcclxuICAgICAgICAgICAgICAgIHBpeGVsUmVtYWluOiB0ZW1wUGl4ZWxTaXplIC0gYXJlYVNuYXBzaG90LmFyZWEubWluU2l6ZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBJZiByZWR1Y2VkIHVuZGVyIHplcm8gPiByZXR1cm4gcmVtYWluaW5nIHBpeGVsc1xyXG4gICAgICAgIGVsc2UgaWYodGVtcFBpeGVsU2l6ZSA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGFyZWFTbmFwc2hvdCxcclxuICAgICAgICAgICAgICAgIHBpeGVsQWJzb3JiOiAtYXJlYVNuYXBzaG90LnNpemVQaXhlbEF0U3RhcnQsXHJcbiAgICAgICAgICAgICAgICBwZXJjZW50QWZ0ZXJBYnNvcnB0aW9uOiAtMSxcclxuICAgICAgICAgICAgICAgIHBpeGVsUmVtYWluOiBwaXhlbHMgKyBhcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBhcmVhU25hcHNob3QsXHJcbiAgICAgICAgICAgIHBpeGVsQWJzb3JiOiBwaXhlbHMsXHJcbiAgICAgICAgICAgIHBlcmNlbnRBZnRlckFic29ycHRpb246IC0xLFxyXG4gICAgICAgICAgICBwaXhlbFJlbWFpbjogMFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcmVhU2l6ZSh1bml0OiAncGVyY2VudCcgfCAncGl4ZWwnLCBpdGVtOiBJQXJlYUFic29ycHRpb25DYXBhY2l0eSkge1xyXG4gICAgXHJcbiAgICBpZih1bml0ID09PSAncGVyY2VudCcpIHtcclxuICAgICAgICBpdGVtLmFyZWFTbmFwc2hvdC5hcmVhLnNpemUgPSBpdGVtLnBlcmNlbnRBZnRlckFic29ycHRpb247XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKHVuaXQgPT09ICdwaXhlbCcpIHtcclxuICAgICAgICAvLyBVcGRhdGUgc2l6ZSBleGNlcHQgZm9yIHRoZSB3aWxkY2FyZCBzaXplIGFyZWFcclxuICAgICAgICBpZihpdGVtLmFyZWFTbmFwc2hvdC5hcmVhLnNpemUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgaXRlbS5hcmVhU25hcHNob3QuYXJlYS5zaXplID0gaXRlbS5hcmVhU25hcHNob3Quc2l6ZVBpeGVsQXRTdGFydCArIGl0ZW0ucGl4ZWxBYnNvcmI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19