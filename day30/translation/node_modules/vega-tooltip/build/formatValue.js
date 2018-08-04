import * as tslib_1 from "tslib";
import { isArray, isObject, isString } from 'vega-util';
/**
 * Format the value to be shown in the toolip.
 *
 * @param value The value to show in the tooltip.
 * @param valueToHtml Function to convert a single cell value to an HTML string
 */
export function formatValue(value, valueToHtml, maxDepth) {
    if (isArray(value)) {
        return "[" + value.map(function (v) { return valueToHtml(isString(v) ? v : stringify(v, maxDepth)); }).join(', ') + "]";
    }
    if (isObject(value)) {
        var content = '';
        var _a = value, title = _a.title, rest = tslib_1.__rest(_a, ["title"]);
        if (title) {
            content += "<h2>" + valueToHtml(title) + "</h2>";
        }
        var keys = Object.keys(rest);
        if (keys.length > 0) {
            content += '<table>';
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var val = rest[key];
                if (isObject(val)) {
                    val = stringify(val, maxDepth);
                }
                content += "<tr><td class=\"key\">" + valueToHtml(key) + ":</td><td class=\"value\">" + valueToHtml(val) + "</td></tr>";
            }
            content += "</table>";
        }
        return content || '{}'; // show empty object if there are no properties
    }
    return valueToHtml(value);
}
export function replacer(maxDepth) {
    var stack = [];
    return function (key, value) {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        var pos = stack.indexOf(this) + 1;
        stack.length = pos;
        if (stack.length > maxDepth) {
            return '[Object]';
        }
        if (stack.indexOf(value) >= 0) {
            return '[Circular]';
        }
        stack.push(value);
        return value;
    };
}
/**
 * Stringify any JS object to valid JSON
 */
export function stringify(obj, maxDepth) {
    return JSON.stringify(obj, replacer(maxDepth));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0VmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZm9ybWF0VmFsdWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUV4RDs7Ozs7R0FLRztBQUNILE1BQU0sc0JBQXNCLEtBQVUsRUFBRSxXQUFtQyxFQUFFLFFBQWdCO0lBQzNGLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sTUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQUcsQ0FBQztLQUNoRztJQUVELElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ25CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVqQixJQUFNLFVBQWlDLEVBQS9CLGdCQUFLLEVBQUUsb0NBQXdCLENBQUM7UUFFeEMsSUFBSSxLQUFLLEVBQUU7WUFDVCxPQUFPLElBQUksU0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQU8sQ0FBQztTQUM3QztRQUVELElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLElBQUksU0FBUyxDQUFDO1lBQ3JCLEtBQWtCLFVBQUksRUFBSixhQUFJLEVBQUosa0JBQUksRUFBSixJQUFJLEVBQUU7Z0JBQW5CLElBQU0sR0FBRyxhQUFBO2dCQUNaLElBQUksR0FBRyxHQUFJLElBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ2pCLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNoQztnQkFFRCxPQUFPLElBQUksMkJBQXVCLFdBQVcsQ0FBQyxHQUFHLENBQUMsa0NBQTJCLFdBQVcsQ0FBQyxHQUFHLENBQUMsZUFBWSxDQUFDO2FBQzNHO1lBQ0QsT0FBTyxJQUFJLFVBQVUsQ0FBQztTQUN2QjtRQUVELE9BQU8sT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLCtDQUErQztLQUN4RTtJQUVELE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVCLENBQUM7QUFFRCxNQUFNLG1CQUFtQixRQUFnQjtJQUN2QyxJQUFNLEtBQUssR0FBVSxFQUFFLENBQUM7SUFFeEIsT0FBTyxVQUFvQixHQUFXLEVBQUUsS0FBVTtRQUNoRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQy9DLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxFQUFFO1lBQzNCLE9BQU8sVUFBVSxDQUFDO1NBQ25CO1FBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixPQUFPLFlBQVksQ0FBQztTQUNyQjtRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEIsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLG9CQUFvQixHQUFRLEVBQUUsUUFBZ0I7SUFDbEQsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDIn0=