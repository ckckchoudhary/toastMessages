
/**
 * ToastMessage Plugin
 * @author Chetan Kumar | ckckchoudhary@gmail.com | +91-7702049911 | facebook.com/xychetan
 */
!function () {
    //--------------------------- Adding Polyfill for Object.assign  ------------------------------//
    // Please read bottom : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------------//
    var template = '<div class="outerLayer" style="{{outerStyle}}"><div class="innerLayer" style="{{innerStyle}}">{{message}}</div></div>';
    var errorMessage = "Some Error Occured while appending Template Message. If the error is due to some error in the Plugin iteself please raise an Issue on Github.";
    var errorMessageStyles = "Some Error Occured while applying Styles. Please check the styles object Passed. If the error is due to some error in the Plugin iteself please raise an Issue on Github."
    var showWarnings = true;
    var outerLayerConstStyles = {
        'max-width': '70vw',
        'margin-left': '11vw',
        'background': '#000000b8',
        'padding': '5px',
        'border-radius': '99999999999999999px',
        'box-shadow': '1px 4px 10px grey'
    };
    var innerLayerConstStyles = {
        'margin': '2px',
        'border': '1px solid #656060',
        'border-radius': '99999999999999999999999px',
        'padding': '2px',
        'color': 'white',        
    };
    var appendMessage = function (messageHtml, messageTime, messageStyles) {
        try {
            var docBody = document.getElementsByTagName('body')[0];
            var htmlToAppend = parseTemplate(messageHtml, messageStyles);
            var messageWrapper = document.createElement('div');
            messageWrapper.innerHTML = htmlToAppend;
            messageWrapper.style.position = 'fixed';
            messageWrapper.style.bottom = '20vh';
            messageWrapper.style['text-align'] = 'center';
            messageWrapper.style.width = '100vw';
            docBody.appendChild(messageWrapper);
            setTimeout(function () {
                docBody.removeChild(messageWrapper);
            }, messageTime || 3000);
        } catch (e) {
            console.error('Toast Message Error: ', errorMessage, e);
        }
    };
    var parseTemplate = function (message, messageStyles) {
        var currentTemplate = template;
        if (message) {
            currentTemplate = currentTemplate.replace('{{message}}', message);
            currentTemplate = currentTemplate.replace('{{innerStyle}}', messageStyles.innerStyles);
            currentTemplate = currentTemplate.replace('{{outerStyle}}', messageStyles.outerStyles);

        } else {
            currentTemplate = currentTemplate.replace('{{message}}', '');
            currentTemplate = currentTemplate.replace('{{innerStyle}}', messageStyles.innerStyles);
            currentTemplate = currentTemplate.replace('{{outerStyle}}', messageStyles.outerStyles);
        }
        return currentTemplate;
    };

    var mergeStyles = function (style1, style2) {
        if (showWarnings) {
            if (console.warn) {
                console.warn('Toast Messages: You have passed a style Object.\n',
                    'The default Styles may be overridden and the messages may not appear as expected.\n',
                    'Default Styles:' + JSON.stringify(style2) + '\n',
                    'Passed Styles:' + JSON.stringify(style1) + '\n'
                );
            }
            else if (console.log) {
                console.log('Toast Messages: You have passed a style Object.\n',
                    'The default Styles may be overridden and the messages may not appear as expected.\n',
                    'Default Styles:' + JSON.stringify(style2) + '\n',
                    'Passed Styles:' + JSON.stringify(style1) + '\n'
                );
            }
        }
        var mergedStyles = Object.assign(style2, style1);
        var styleString = '';
        var allStyles = Object.keys(mergedStyles);
        for (var x = 0; x < allStyles.length; x++) {
            styleString += allStyles[x] + ':' + mergedStyles[allStyles[x]] + ';';
        }
        return styleString;
    };

    var calculateStyles = function (styles, outer) {
        if (outer) {
            try {
                if (styles && Object.keys(styles).length) {
                    return mergeStyles(styles, outerLayerConstStyles);
                } else if (styles && !Object.keys(styles).length) {
                    return 'max-width:70vw; margin-left:11vw; background:#000000b8; color:white; padding:5px; border-radius:99999999999999999px; box-shadow: 1px 4px 10px grey';
                } else {
                    return 'max-width:70vw; margin-left:11vw; background:#000000b8; color:white; padding:5px; border-radius:99999999999999999px; box-shadow: 1px 4px 10px grey';
                }
            } catch (e) {
                console.error('Toast Message Error: ', errorMessageStyles, e);
                return 'max-width:70vw; margin-left:11vw; background:#000000b8; color:white; padding:5px; border-radius:99999999999999999px; box-shadow: 1px 4px 10px grey';
            }
        } else {
            try {
                if (styles && Object.keys(styles).length) {
                    return mergeStyles(styles, innerLayerConstStyles);
                } else if (styles && !Object.keys(styles).length) {
                    return 'margin:2px; border:1px solid #656060; border-radius:99999999999999999999999px; padding:2px;';
                } else {
                    return 'margin:2px; border:1px solid  #656060; border-radius:99999999999999999999999px; padding:2px';
                }
            } catch (e) {
                console.error('Toast Message Error: ', errorMessageStyles, e);
                return 'margin:2px; border:1px solid #656060; border-radius:99999999999999999999999px; padding:2px';
            }
        }
    };

    window.toastNow = function (options) {
        try {
            if (!options) {
                options = {};
            }
            var time = options.time || 3000;
            var outerStyles = calculateStyles(options.outerStyles, 1);
            var innerStyles = calculateStyles(options.innerStyles);
            var messageHtml = options.message || '';
            showWarnings = options.showWarnings || true;
            appendMessage(messageHtml, time, { outerStyles, innerStyles });
        } catch (e) {
            console.error('Toast Message Error: Please cehck the options Passed', options, e);
        }
    };

}()