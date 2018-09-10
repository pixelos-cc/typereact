'use strict';

require('raf/polyfill');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _enzyme2 = _interopRequireDefault(_enzyme);

var _enzymeAdapterReact = require('enzyme-adapter-react-16');

var _enzymeAdapterReact2 = _interopRequireDefault(_enzymeAdapterReact);

var _Typeahead = require('./Typeahead');

var _Typeahead2 = _interopRequireDefault(_Typeahead);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_enzyme2.default.configure({ adapter: new _enzymeAdapterReact2.default() });

function MockAutoSizer(_ref) {
    var children = _ref.children;

    return _react2.default.createElement(
        'div',
        null,
        children({ width: 300, height: 768 })
    );
}

jest.mock('react-virtualized/dist/commonjs/AutoSizer', function () {
    return MockAutoSizer;
});

var KEY_TAB = 9;
var KEY_ENTER = 13;
var KEY_NUMPAD_ENTER = 176;
var KEY_UP = 38;
var KEY_DOWN = 40;

var options = [{ label: 'label1', value: 'value1' }, { label: 'label2', value: 'value2' }, { label: 'special1', value: 'value3' }, { label: 'special2', value: 'value4' }];

var manyOptions = [].concat(options, [{ label: 'label3', value: 'value3' }, { label: 'label4', value: 'value4' }, { label: 'label5', value: 'value5' }, { label: 'label6', value: 'value6' }, { label: 'label7', value: 'value7' }, { label: 'label8', value: 'value8' }, { label: 'label9', value: 'value9' }, { label: 'label10', value: 'value10' }]);

var option = {
    label: 'label',
    value: 'value'
};

var groups = [{ label: 'Group 1', value: 'group1' }, { label: 'Group 2', value: 'group2' }];

var optionsWithGroups = [{ label: 'label1', value: 'value1', group: 'group1' }, { label: 'label2', value: 'value2', group: 'group2' }, { label: 'label3', value: 'value3', group: 'group1' }, { label: 'label4', value: 'value4', group: 'group2' }];

describe('Typeahead should', function () {
    it('render with fieldName only', function () {
        (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
    });

    it('render with options', function () {
        (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
    });

    it('render id prop if specified', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', id: 'typeahead' }));
        expect(wrapper.find('input[id="typeahead"]')).toHaveLength(1);
    });

    it('not render id prop when omitted', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
        expect(wrapper.find('input[id]')).toHaveLength(0);
    });

    it('render tabIndex prop if specified', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', tabIndex: 1 }));
        expect(wrapper.find('input').prop('tabIndex')).toBe(1);
    });

    it('not render tabIndex prop when omitted', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
        expect(wrapper.find('input').prop('tabIndex')).not.toBeDefined();
    });

    it('render with className typeahead if no className is given', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
        expect(wrapper.hasClass('typeahead')).toBe(true);
    });

    it('render with the given className', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', className: 'customclass1 customclass2' }));
        expect(wrapper.hasClass('customclass1')).toBe(true);
        expect(wrapper.hasClass('customclass2')).toBe(true);
        expect(wrapper.hasClass('typeahead')).not.toBe(true);
    });

    it('not open menu by default', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('open menu on focus enter', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');

        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('open menu on any key down', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('keyDown', { which: 'a' });

        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('open menu on arrow key down', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });

        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('close menu on focus lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('blur');

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('not close menu while scrolling even though focus is lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('.typeahead__options').simulate('mouseDown');
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('isOpen')).toBe(true);
    });

    it('close menu after scrolling on focus lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('.typeahead__options').simulate('mouseDown');
        wrapper.find('input').simulate('blur');
        wrapper.find('.typeahead__options').simulate('mouseUp');
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('close menu on focus lost with unknown value', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', allowUnknownValue: true, options: options }));
        simulateKeys(wrapper.find('input'), 'unknown');
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('blur');

        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('accept value from props when value is known from options', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'value1' }));
        expect(wrapper.find('input').prop('value')).toEqual('label1');
    });

    it('not accept value from props when value is not known from options', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'unknownValue' }));
        expect(wrapper.find('input').prop('value')).toEqual('');
    });

    it('update value from props when value prop has changed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'value1' }));
        wrapper.setProps({
            value: 'value2'
        });
        expect(wrapper.find('input').prop('value')).toEqual('label2');
    });

    it('render menu when focussed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('.typeahead__options').exists()).toBe(true);
    });

    it('render menu when clicked', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('mouseDown');
        expect(wrapper.find('.typeahead__options').exists()).toBe(true);
    });

    it('render options in menu when focussed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(value1Option.exists()).toBe(true);
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(value2Option.exists()).toBe(true);
    });

    it('highlight option with value from props', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'value1' }));
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight no option when no value is set', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        var highlightedOption = wrapper.find('.typeahead__option[data-highlighted=true]');
        expect(highlightedOption.exists()).toEqual(false);
    });

    it('highlight first option when no value is set and arrow down key is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight first option when no value is set and arrow down key is pressed with groups', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', groups: groups, options: optionsWithGroups }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('not highlight any option when no options exist and arrow down key is pressed with groups', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', groups: groups, options: [] }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-highlighted]');
        expect(value1Option.exists()).toEqual(false);
    });

    it('highlight special option when unknown value is set and arrow up key is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true,
            value: 'unknown' }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP });
        var unknownValueOption = wrapper.find('.typeahead__option[data-value="unknown"]');
        expect(Boolean(unknownValueOption.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight second option when no value is set and arrow down key is pressed twice', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight last option when arrow down key is pressed more often than options exist', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value4"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight second option in a filtered list when no value is set and arrow down key is pressed twice', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'spe');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value4"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight the right option in a filtered list when no value is set and arrow down key is pressed twice', function () {
        var optionsForFilter = [{ label: 'nomatch', value: 'value1' }, { label: 'nomatch', value: 'value2' }, { label: 'match haus', value: 'value3' }, { label: 'nomatch', value: 'value4' }, { label: 'match haus 2', value: 'value5' }];
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsForFilter }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'haus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        var value1Option = wrapper.find('.typeahead__option[data-value="value5"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('highlight first option when no value is set and arrow up key is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP });
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('filter rendered options when (partial) value is entered', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'label2');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(value1Option.exists()).toBe(false);
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(value2Option.exists()).toBe(true);
    });

    it('highlight first filtered option when (partial) value is entered', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'label1');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(value1Option.exists()).toBe(true);
        expect(Boolean(value1Option.prop('data-highlighted'))).toEqual(true);
    });

    it('not update value to highlighted option when no other key is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'value1' }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        expect(wrapper.state('value')).toEqual('value1');
    });

    it('update value to highlighted option when tab is pressed and focus is lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('update value to highlighted option when enter is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('update value to highlighted option when numpad enter is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_NUMPAD_ENTER });
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('not do anything when enter is pressed and the menu is closed', function () {
        var handleBlur = jest.fn();
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur,
            onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_NUMPAD_ENTER });
        expect(wrapper.state('value')).toEqual(undefined);
        expect(handleBlur.mock.calls).toHaveLength(0);
        expect(handleChange.mock.calls).toHaveLength(0);
    });

    it('update value to highlighted option after highlight changes when tab is pressed and focus is lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('update value to highlighted option after highlight changes when enter is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // => value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('update value to clicked option', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value2Option.simulate('mouseDown');
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('render initial value', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, value: 'value1' }));
        expect(wrapper.find('input').prop('value')).toEqual('label1');
    });

    it('render updated value', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP }); // => value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(wrapper.find('input').prop('value')).toEqual('label1');
    });

    it('close menu when tab is pressed and focus is lost', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('close menu when enter is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('close menu when option is clicked', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value1"]');
        value2Option.simulate('mouseDown');
        expect(wrapper.state('isOpen')).toBe(false);
    });

    it('be disabled when isDisabled prop is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', isDisabled: true }));
        expect(Boolean(wrapper.find('input').prop('disabled'))).toEqual(true);
    });

    it('not be disabled when isDisabled prop is false', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', isDisabled: false }));
        expect(Boolean(wrapper.find('input').prop('disabled'))).toEqual(false);
    });

    it('not be disabled when isDisabled prop is missing', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
        expect(Boolean(wrapper.find('input').prop('disabled'))).toEqual(false);
    });

    it('call onChange prop with fieldName and value when value is set using arrow keys and pressing enter', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][0]).toBe('fieldName');
        expect(handleChange.mock.calls[0][1]).toBe('value1');
    });

    it('call onBlur prop with fieldName and value when value is set using arrow keys with filtered options, ' + 'pressing enter and losing focus', function () {
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'special');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        wrapper.find('input').simulate('blur');
        expect(handleBlur.mock.calls.length).toBe(1);
        expect(handleBlur.mock.calls[0][0]).toBe('fieldName');
        expect(handleBlur.mock.calls[0][1]).toBe('value4');
    });

    it('call onBlur prop with fieldName and undefined as value when unknown value is typed but not allowed', function () {
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur }));
        simulateKeys(wrapper.find('input'), 'unknown');
        wrapper.find('input').simulate('blur');
        expect(handleBlur.mock.calls.length).toBe(1);
        expect(handleBlur.mock.calls[0][0]).toBe('fieldName');
        expect(handleBlur.mock.calls[0][1]).toBe(undefined);
    });

    it('call onChange prop with fieldName and value when value is set using arrow keys and losing focus', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][0]).toBe('fieldName');
        expect(handleChange.mock.calls[0][1]).toBe('value2');
    });

    it('call onChange prop with fieldName and value when value is set using mouse click', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        value1Option.simulate('mouseDown');
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][0]).toBe('fieldName');
        expect(handleChange.mock.calls[0][1]).toBe('value1');
    });

    it('not call onChange with fieldName and value when allowUnknownValue prop is missing and value is unknown', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        expect(handleChange.mock.calls.length).toBe(0);
    });

    it('call onChange with fieldName and value when allowUnknownValue prop is true and value is unknown', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][0]).toBe('fieldName');
        expect(handleChange.mock.calls[0][1]).toBe('unknownValue');
    });

    it('call onBlur with fieldName and value when focus is lost', function () {
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('blur');
        expect(handleBlur.mock.calls.length).toBe(1);
        expect(handleBlur.mock.calls[0][0]).toBe('fieldName');
        expect(handleBlur.mock.calls[0][1]).toBe('value1');
    });

    it('call onChange only once when focus is lost by pressing tab', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(1);
    });

    it('call onChange multiple times when value is changed multiple times', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(handleChange.mock.calls.length).toBe(1);
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value1
        expect(wrapper.find('input').prop('value')).toEqual('label1');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(wrapper.find('input').prop('value')).toEqual('label2');
        expect(handleChange.mock.calls.length).toBe(2);
    });

    it('call onChange multiple times with the correct values', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value1
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN }); // value2
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(2);
        expect(handleChange.mock.calls[0][1]).toBe('value1');
        expect(handleChange.mock.calls[1][1]).toBe('value2');
    });

    it('call onChange with new value when value is changed by clicking', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value2Option.simulate('mouseDown');
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        value1Option.simulate('mouseDown');
        expect(handleChange.mock.calls.length).toBe(2);
        expect(handleChange.mock.calls[0][1]).toEqual('value2');
        expect(handleChange.mock.calls[1][1]).toEqual('value1');
    });

    it('call onChange and onBlur with new value when value is changed by clicking and blurring', function () {
        var handleChange = jest.fn();
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value2Option.simulate('mouseDown');
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][1]).toEqual('value2');
        expect(handleBlur.mock.calls.length).toBe(1);
        expect(handleBlur.mock.calls[0][1]).toEqual('value2');
    });

    it('call onChange and onBlur with new value when value is changed by clicking and blurring repeatedly', function () {
        var handleChange = jest.fn();
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onChange: handleChange, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value2Option.simulate('mouseDown');
        wrapper.setProps({ value: 'value2' });
        wrapper.update();
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        value1Option.simulate('mouseDown');
        wrapper.find('input').simulate('blur');
        wrapper.find('input').simulate('blur');
        expect(handleChange.mock.calls.length).toBe(2);
        expect(handleChange.mock.calls[0][1]).toEqual('value2');
        expect(handleChange.mock.calls[1][1]).toEqual('value1');
        expect(handleBlur.mock.calls.length).toBe(2);
        expect(handleBlur.mock.calls[0][1]).toEqual('value1');
        expect(handleBlur.mock.calls[1][1]).toEqual('value1');
    });

    it('set new label when value is changed by clicking', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value2Option.simulate('mouseDown');
        expect(wrapper.find('input').prop('value')).toEqual('label2');
        wrapper.find('input').simulate('focus');
        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        value1Option.simulate('mouseDown');
        expect(wrapper.find('input').prop('value')).toEqual('label1');
    });

    it('call onBlur only once when focus is lost by pressing tab', function () {
        var handleBlur = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(handleBlur.mock.calls.length).toBe(1);
    });

    it('lose focus when tab is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName' }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        expect(document.activeElement.tagName).toEqual('BODY');
    });

    it('render no found options message when unknown value is entered', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        expect(wrapper.find('.typeahead__no_options').exists()).toBe(true);
        expect(wrapper.find('.typeahead__no_options__keyword').text()).toEqual('unknownValue');
        expect(wrapper.find('.typeahead__no_options').html()).toContain('nicht gefunden');
    });

    it('not render no found options message when unknown value is entered and allowUnknownValue is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        expect(wrapper.find('.typeahead__no_options').exists()).toBe(false);
    });

    it('render special option while typing for unknown value when allowUnknownValue is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        expect(wrapper.find('.typeahead__option').exists()).toBe(true);
        expect(wrapper.find('.typeahead__option').html()).toContain('unknownValue');
        expect(wrapper.find('.typeahead__option').html()).toContain('(+)');
    });

    it('render special option when menu is reopened for unknown value when allowUnknownValue is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'unknownValue');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('.typeahead__option[data-value="unknownValue"]').exists()).toBe(true);
        expect(wrapper.find('.typeahead__option[data-value="unknownValue"]').html()).toContain('unknownValue');
        expect(wrapper.find('.typeahead__option[data-value="unknownValue"]').html()).toContain('(+)');
    });

    it('render clear button when isClearable prop is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true, isClearable: true,
            value: 'value1' }));
        expect(wrapper.find('.typeahead__clear').exists()).toBe(true);
    });

    it('not render clear button when isDisabled prop is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true, isClearable: true,
            isDisabled: true, value: 'value1' }));
        expect(wrapper.find('.typeahead__clear').exists()).toBe(false);
    });

    it('clear value when clear button is clicked', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true, isClearable: true,
            value: 'value1' }));
        wrapper.find('.typeahead__clear').simulate('click');
        expect(wrapper.state('value')).not.toBeDefined();
        expect(wrapper.state('highlightedIndex')).not.toBeDefined();
        expect(wrapper.state('typedLabel')).toEqual('');
    });

    it('clear value when label is emptied and isClearable is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, isClearable: true }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_TAB });
        wrapper.find('input').simulate('blur');
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('change', { target: { value: '' } });
        wrapper.find('input').simulate('blur');
        expect(wrapper.find('input').prop('value')).toEqual('');
    });

    it('call onChange with empty value when clear button is clicked', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true, isClearable: true,
            value: 'value1', onChange: handleChange }));
        wrapper.find('.typeahead__clear').simulate('click');
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][1]).toBeUndefined();
    });

    it('set value to the first option when autoSelectSingleOption is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [option], autoSelectSingleOption: true }));
        expect(wrapper.find('input').prop('value')).toEqual('label');
    });

    it('call onChange with the first option when autoSelectSingleOption is true', function () {
        var handleChange = jest.fn();
        (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [option], autoSelectSingleOption: true, onChange: handleChange }));
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][1]).toEqual('value');
    });

    it('call onChange with the first option when autoSelectSingleOption is true and props changed', function () {
        var handleChange = jest.fn();
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [option], onChange: handleChange }));
        expect(handleChange.mock.calls.length).toBe(0);
        wrapper.setProps({
            autoSelectSingleOption: true
        });
        expect(handleChange.mock.calls.length).toBe(1);
        expect(handleChange.mock.calls[0][1]).toEqual('value');
    });

    it('render groups when groups prop is provided', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups }));
        wrapper.find('input').simulate('focus');

        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(value1Option.exists()).toBe(true);
        expect(value1Option.prop('data-group')).toEqual('group1');

        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(value2Option.exists()).toBe(true);
        expect(value2Option.prop('data-group')).toEqual('group2');

        var value3Option = wrapper.find('.typeahead__option[data-value="value3"]');
        expect(value3Option.exists()).toBe(true);
        expect(value3Option.prop('data-group')).toEqual('group1');

        var value4Option = wrapper.find('.typeahead__option[data-value="value4"]');
        expect(value4Option.exists()).toBe(true);
        expect(value4Option.prop('data-group')).toEqual('group2');

        var group1 = wrapper.find('.typeahead__group[data-value="group1"]');
        expect(group1.exists()).toBe(true);
        var group2 = wrapper.find('.typeahead__group[data-value="group2"]');
        expect(group2.exists()).toBe(true);
    });

    it('select single option when exactly searching for an option in a grouped list', function () {
        var singleGroup = [{ label: 'Group 1', value: 'group1' }];
        var optionsWithGroups = [{ label: 'label1', value: 'value1', group: 'group1' }, { label: 'label2', value: 'value2', group: 'group1' }];
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: singleGroup }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'label2');
        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(value2Option.exists()).toBe(true);
        expect(value2Option.prop('data-group')).toEqual('group1');
        expect(Boolean(value2Option.prop('data-highlighted'))).toEqual(true);
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('render options of a group when searching for a group label', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'Group 1');

        var value1Option = wrapper.find('.typeahead__option[data-value="value1"]');
        expect(value1Option.exists()).toBe(true);
        expect(value1Option.prop('data-group')).toEqual('group1');

        var value2Option = wrapper.find('.typeahead__option[data-value="value2"]');
        expect(value2Option.exists()).toBe(false);

        var value3Option = wrapper.find('.typeahead__option[data-value="value3"]');
        expect(value3Option.exists()).toBe(true);
        expect(value3Option.prop('data-group')).toEqual('group1');

        var value4Option = wrapper.find('.typeahead__option[data-value="value4"]');
        expect(value4Option.exists()).toBe(false);

        var group1 = wrapper.find('.typeahead__group[data-value="group1"]');
        expect(group1.exists()).toBe(true);
        var group2 = wrapper.find('.typeahead__group[data-value="group2"]');
        expect(group2.exists()).toBe(false);
    });

    it('render empty groups when renderEmptyGroups prop is true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups,
            renderEmptyGroups: true }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'does not exist');

        var group1 = wrapper.find('.typeahead__group[data-value="group1"]');
        expect(group1.exists()).toBe(true);
        var group2 = wrapper.find('.typeahead__group[data-value="group2"]');
        expect(group2.exists()).toBe(true);
    });

    it('not render empty groups when renderEmptyGroups prop is false', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups,
            renderEmptyGroups: false }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'does not exist');

        var group1 = wrapper.find('.typeahead__group[data-value="group1"]');
        expect(group1.exists()).toBe(false);
        var group2 = wrapper.find('.typeahead__group[data-value="group2"]');
        expect(group2.exists()).toBe(false);
    });

    it('not render empty groups when renderEmptyGroups prop is missing', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'does not exist');

        var group1 = wrapper.find('.typeahead__group[data-value="group1"]');
        expect(group1.exists()).toBe(false);
        var group2 = wrapper.find('.typeahead__group[data-value="group2"]');
        expect(group2.exists()).toBe(false);
    });

    it('select correct option using mouse click when options are filtered', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'bel2');
        var value1Option = wrapper.find('.typeahead__option[data-value="value2"]');
        value1Option.simulate('mouseDown');
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('value')).toEqual('value2');
    });

    it('not crash when options are filtered and an outside click occurs', function (done) {
        var handleBlur = function handleBlur() {
            return done();
        };
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, onBlur: handleBlur }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'bel2');
        wrapper.find('input').simulate('blur');
    });

    it('not crash when options are filtered and arrow key up is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.find('input').simulate('focus');
        simulateKeys(wrapper.find('input'), 'bel2');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_UP });
    });

    it('select correct option when value is set before options (due to race condition)', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [], value: 'myVal' }));
        expect(wrapper.state('typedLabel')).toEqual(''); // label cannot be set, no options available
        wrapper.setProps({ options: [{ value: 'myVal', label: 'somethingElse' }] });
        expect(wrapper.state('typedLabel')).toEqual('somethingElse'); // label can now be set appropriately
    });

    it('select last option more key down is pressed more often than options exist', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        for (var keyPressCount = 0; keyPressCount <= options.length + 5; keyPressCount++) {
            wrapper.find('input').simulate('keyDown', { keyCode: KEY_DOWN });
        }
        wrapper.find('input').simulate('blur');
        expect(wrapper.state('value')).toEqual('value4');
    });

    it('keep selection of allowed unknown option when enter is pressed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, allowUnknownValue: true,
            value: 'unknown' }));
        wrapper.find('input').simulate('focus');
        wrapper.find('input').simulate('keyDown', { keyCode: KEY_ENTER });
        expect(wrapper.state('value')).toEqual('unknown');
    });

    it('throw an error if groups are enabled but at least one option does not specify its group', function () {
        try {
            (0, _enzyme.shallow)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', groups: groups, options: options }));
            fail();
        } catch (_) {}
    });

    it('throw an error if groups are enabled and one option references an unknown group', function () {
        var invalidOptions = [{ label: 'label', value: 'value', group: 'does not exist' }];
        try {
            (0, _enzyme.shallow)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', groups: groups, options: invalidOptions }));
            fail();
        } catch (_) {}
    });

    it('change menu open direction on resize events', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        expect(wrapper.state('menuOpenDirection')).toEqual('down');
        resizeTo(1024, 1);
        expect(wrapper.state('menuOpenDirection')).toEqual('up');
        resizeTo(1024, 768);
        expect(wrapper.state('menuOpenDirection')).toEqual('down');
    });

    it('change menu open direction on scroll events', function () {
        (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        scrollTo(768);
        // Unfortunately, there is no way in JSDOM to update the calculated values of getBoundingClientRect().
        // Therefore, there is no assertion that would work here.
    });

    it('change menu open direction initially', function () {
        resizeTo(1024, 1);
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        expect(wrapper.state('menuOpenDirection')).toEqual('up');
    });

    it('change menu open direction after props have changed', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: manyOptions }));
        resizeTo(1024, 170);
        expect(wrapper.state('menuOpenDirection')).toEqual('up');
        wrapper.setProps({ options: [] });
        expect(wrapper.state('menuOpenDirection')).toEqual('down');
    });

    it('not react to resize events after unmount', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.unmount();
        resizeTo(1024, 1);
        resizeTo(1024, 768);
        wrapper.mount();
        expect(wrapper.state('menuOpenDirection')).toEqual('down');
    });

    it('not react to scroll events after unmount', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options }));
        wrapper.unmount();
        scrollTo(768);
        scrollTo(0);
        wrapper.mount();
        expect(wrapper.state('menuOpenDirection')).toEqual('down');
    });

    it('use menuWidth', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, menuWidth: 500 }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('.typeahead__options').prop('style').width).toEqual('500px');
    });

    it('use estimateMenuWidth = true', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options, estimateMenuWidth: true }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('.typeahead__options').prop('style').width).toEqual('54px');
    });

    it('use estimateMenuWidth callback', function () {
        var calculateMenuWidth = function calculateMenuWidth() {
            return 500;
        };
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options,
            estimateMenuWidth: calculateMenuWidth }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('[role="grid"]').at(1).prop('style').width).toEqual(500);
    });

    it('use estimateMenuWidth = true with groups', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: optionsWithGroups, groups: groups,
            estimateMenuWidth: true }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('[role="grid"]').at(1).prop('style').width).toEqual(296);
    });

    it('use estimateMenuWidth = true with groups and no options', function () {
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [], groups: groups,
            estimateMenuWidth: true }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('[role="grid"]').at(1).prop('style').width).toEqual(296);
    });

    it('use estimateMenuWidth callback without options', function () {
        var calculateMenuWidth = function calculateMenuWidth() {
            return 500;
        };
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: [],
            estimateMenuWidth: calculateMenuWidth }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('[role="grid"]').at(1).prop('style').width).toEqual(500);
    });

    it('use default menuWidth when estimateMenuWidth callback result is smaller', function () {
        var calculateMenuWidth = function calculateMenuWidth() {
            return 200;
        };
        var wrapper = (0, _enzyme.mount)(_react2.default.createElement(_Typeahead2.default, { fieldName: 'fieldName', options: options,
            estimateMenuWidth: calculateMenuWidth }));
        wrapper.find('input').simulate('focus');
        expect(wrapper.find('[role="grid"]').at(1).prop('style').width).toEqual(296);
    });

    function simulateKeys(wrapper, text) {
        var input = wrapper.find('input');
        for (var i = 0; i < text.length; i++) {
            var charCode = text.charCodeAt(i);
            var keyEvent = {
                which: charCode,
                key: text[i],
                keyCode: charCode
            };
            input.simulate('keyDown', keyEvent);
            input.simulate('keyPress', keyEvent);
            input.simulate('keyUp', keyEvent);
            input.simulate('change', {
                target: {
                    value: text.substring(0, i + 1)
                }
            });
        }
    }

    function resizeTo(width, height) {
        var resizeEvent = document.createEvent('Event');
        resizeEvent.initEvent('resize', true, true);

        window.innerWidth = width || window.innerWidth;
        window.innerHeight = height || window.innerHeight;
        window.dispatchEvent(resizeEvent);
    }

    function scrollTo(top) {
        var resizeEvent = document.createEvent('Event');
        resizeEvent.initEvent('scroll', true, true);
        window.top = top;
        window.dispatchEvent(resizeEvent);
    }
});