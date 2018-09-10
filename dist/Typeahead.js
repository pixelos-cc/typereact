'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _List = require('react-virtualized/dist/commonjs/List');

var _List2 = _interopRequireDefault(_List);

var _AutoSizer = require('react-virtualized/dist/commonjs/AutoSizer');

var _AutoSizer2 = _interopRequireDefault(_AutoSizer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTION_HEIGHT = 28;
var DEFAULT_GROUP_PADDING = 31;
var DEFAULT_NO_OPTIONS_HEIGHT = DEFAULT_OPTION_HEIGHT;
var DEFAULT_LIST_HEIGHT = 300;
var DEFAULT_GERMAN_NOT_FOUND_LABEL = 'nicht gefunden';
var DEFAULT_VALUE = undefined;
var DEFAULT_LABEL = '';
var DEFAULT_ESTIMATED_CHARACTER_WIDTH = 6.75;
var KEY_TAB = 9;
var KEY_ENTER = 13;
var KEY_NUMPAD_ENTER = 176;
var KEY_UP = 38;
var KEY_DOWN = 40;
var AUTO_SIZER_PADDING = 4;

var UNKNOWN_VALUE_HIGHLIGHTED = -1;
var NOTHING_HIGHLIGHTED = undefined;

var MENU_OPEN_DIRECTION_DOWN = 'down';
var MENU_OPEN_DIRECTION_UP = 'up';

var INITIAL_STATE = {
    highlightedRowIndex: NOTHING_HIGHLIGHTED,
    isOpen: false,
    typedLabel: '',
    value: undefined,
    props: undefined,
    menuOpenDirection: MENU_OPEN_DIRECTION_DOWN
};

var Typeahead = function (_PureComponent) {
    (0, _inherits3.default)(Typeahead, _PureComponent);

    function Typeahead() {
        var _ref;

        var _temp, _this, _ret;

        (0, _classCallCheck3.default)(this, Typeahead);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Typeahead.__proto__ || (0, _getPrototypeOf2.default)(Typeahead)).call.apply(_ref, [this].concat(args))), _this), _this.state = INITIAL_STATE, _this._getSortedOptions = (0, _memoizeOne2.default)(function (props) {
            return _sortOptionsByGroup(props.options, props.groups);
        }), _this.elementRefs = {}, _this.isMouseDown = false, _this._handleInputFocus = function () {
            _this._openIfPossible();
        }, _this._handleInputMouseDown = function () {
            _this._openIfPossible();
        }, _this._handleInputBlur = function () {
            if (!_this.isMouseDown) {
                var previousValue = _this.state.value;
                _this._updateValue(function () {
                    _this._afterValueChanged(previousValue)();
                    _this._fireOnBlur();
                });
            }
        }, _this._handleInputChange = function (e) {
            var label = e.target.value || DEFAULT_LABEL;
            _this.setState({
                typedLabel: label
            }, function () {
                var highlightedRowIndex = _this._gethighlightedRowIndexByTypedLabel();
                _this.setState({
                    highlightedRowIndex: highlightedRowIndex
                });

                if (label === '' && _this.props.isClearable) {
                    _this._clearValue();
                }

                _this._openIfPossible();
            });
        }, _this._handleInputKeyDown = function (e) {
            if (e.keyCode === KEY_UP) {
                _this.setState({
                    highlightedRowIndex: _this._getPreviousOptionRowIndex()
                });
            } else if (e.keyCode === KEY_DOWN) {
                if (_this.state.isOpen) {
                    _this.setState({
                        highlightedRowIndex: _this._getNextOptionRowIndex()
                    });
                } else {
                    _this._openIfPossible();
                }
            } else if (e.keyCode === KEY_ENTER || e.keyCode === KEY_NUMPAD_ENTER) {
                if (_this.state.isOpen) {
                    var previousValue = _this.state.value;
                    _this._updateValue(_this._afterValueChanged(previousValue));
                }
            } else if (e.keyCode !== KEY_TAB) {
                _this._openIfPossible();
            }
        }, _this._handleClearClick = function (e) {
            e.preventDefault();
            _this._clearValue();
        }, _this._createHandleOptionMouseDown = function (value, highlightedRowIndex) {
            return function (e) {
                e.stopPropagation();
                e.preventDefault();
                var previousValue = _this.state.value;
                _this.setState({
                    highlightedRowIndex: highlightedRowIndex,
                    isOpen: false,
                    typedLabel: Typeahead._getLabelByValue(value, _this.props.options, _this.props.allowUnknownValue),
                    value: value
                }, _this._afterValueChanged(previousValue));
            };
        }, _this._handleListMouseDown = function () {
            _this.isMouseDown = true;
        }, _this._handleListMouseUp = function () {
            _this.isMouseDown = false;
        }, _this._openIfPossible = function () {
            if (!_this.state.isOpen) {
                _this.setState({
                    isOpen: true,
                    highlightedRowIndex: _this._gethighlightedRowIndexByTypedLabel()
                });
            }
        }, _this._gethighlightedRowIndexByTypedLabel = function () {
            var rows = _this._generateRows(_this._getFilteredOptions(), _this.props.groups, _this.props, _this._isUnknownValue());
            // $FlowFixMe Flow does not recognize that filter narrowed down the list to only OptionRows
            var foundRow = rows.filter(_isOptionRow).find(_this._rowByTypedLabel);
            return foundRow ? foundRow.rowIndex : NOTHING_HIGHLIGHTED;
        }, _this._updateValue = function (afterValueUpdated) {
            var shouldUpdateValue = _this.state.isOpen;
            if (shouldUpdateValue) {
                var previousValue = _this.state.value;
                var valueOfHighlightedOption = _this._getValueOfHighlightedOption();
                var isUnknownValue = valueOfHighlightedOption === undefined;
                var isUnknownValueAndAllowed = isUnknownValue && _this.props.allowUnknownValue;
                var nextValue = isUnknownValueAndAllowed ? _this.state.typedLabel : isUnknownValue ? previousValue : valueOfHighlightedOption;
                _this.setState({
                    isOpen: false,
                    highlightedRowIndex: undefined,
                    value: nextValue,
                    typedLabel: Typeahead._getLabelByValue(nextValue, _this.props.options, _this.props.allowUnknownValue)
                }, afterValueUpdated);
            } else {
                afterValueUpdated();
            }
        }, _this._afterValueChanged = function (previousValue) {
            return function () {
                if (previousValue !== _this.state.value) {
                    _this._fireOnChange();
                }
            };
        }, _this._fireOnChange = function () {
            var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.state.value;

            _this.props.onChange(_this.props.fieldName, value);
        }, _this._fireOnBlur = function () {
            _this.props.onBlur(_this.props.fieldName, _this.state.value);
        }, _this._getValueOfHighlightedOption = function () {
            var highlightedRowIndex = _this.state.highlightedRowIndex;
            if (typeof highlightedRowIndex === 'undefined') {
                return DEFAULT_VALUE;
            }
            var rows = _this._generateRows(_this._getFilteredOptions(), _this.props.groups, _this.props, _this._isUnknownValue());
            return _getOptionRow(rows, function (r) {
                return r.rowIndex === highlightedRowIndex;
            }).option.value;
        }, _this._getPreviousOptionRowIndex = function () {
            var currentRowIndex = _this.state.highlightedRowIndex;
            var potentialPreviousOptionIndex = _this._getPotentialPreviousOptionRowIndex();
            var hasPreviousOption = potentialPreviousOptionIndex >= 0;
            if (_this.props.allowUnknownValue && !hasPreviousOption && _this._isUnknownValue()) {
                return UNKNOWN_VALUE_HIGHLIGHTED;
            }
            return hasPreviousOption ? potentialPreviousOptionIndex : currentRowIndex;
        }, _this._getPotentialPreviousOptionRowIndex = function () {
            var currentRowIndex = _this.state.highlightedRowIndex;
            if (currentRowIndex === undefined) {
                return 0;
            }
            var rows = _this._generateRows(_this._getFilteredOptions(), _this.props.groups, _this.props, _this._isUnknownValue());
            var potentialPreviousOptionRow = _findLast(rows, function (r) {
                return r.rowIndex < currentRowIndex && _isOptionRow(r);
            });
            return potentialPreviousOptionRow ? potentialPreviousOptionRow.rowIndex : -1;
        }, _this._getNextOptionRowIndex = function () {
            var currentRowIndex = _this.state.highlightedRowIndex;
            var rows = _this._generateRows(_this._getFilteredOptions(), _this.props.groups, _this.props, _this._isUnknownValue());
            if (currentRowIndex === undefined) {
                return _this._getFirstGroupsFirstOptionIndex(rows);
            }
            var potentialNextOptionRow = _findOptionRow(rows, function (r) {
                return r.rowIndex > currentRowIndex;
            });
            return potentialNextOptionRow ? potentialNextOptionRow.rowIndex : currentRowIndex;
        }, _this._getFirstGroupsFirstOptionIndex = function (rows) {
            var firstOptionRow = _findOptionRow(rows, _thatExist);
            return firstOptionRow ? firstOptionRow.rowIndex : 0;
        }, _this._typedLabelHasText = function () {
            return Boolean(_this.state.typedLabel);
        }, _this._byTypedLabel = function (option) {
            return _this._typedLabelHasText() && option.label.toLowerCase().indexOf(_this.state.typedLabel.toLowerCase()) !== -1;
        }, _this._rowByTypedLabel = function (row) {
            return _this._typedLabelHasText() && row.option.label.toLowerCase().indexOf(_this.state.typedLabel.toLowerCase()) !== -1;
        }, _this._byGroupAndTypedLabel = function (option) {
            if (_this.props.groups !== undefined) {
                var matchingGroupValues = _this.props.groups.filter(_this._byTypedLabel).map(function (group) {
                    return group.value;
                });
                if (matchingGroupValues.indexOf(option.group) !== -1) {
                    return true;
                }
            }
            return _this._byTypedLabel(option);
        }, _this._getFilteredOptions = function () {
            var _this$props = _this.props,
                options = _this$props.options,
                allowUnknownValue = _this$props.allowUnknownValue;

            var currentOptionLabel = Typeahead._getLabelByValue(_this.state.value, options, allowUnknownValue);
            var typedLabelMatchesCurrentOptionLabel = _this.state.typedLabel === currentOptionLabel;
            return typedLabelMatchesCurrentOptionLabel ? _this._getSortedOptions(_this.props) : _this._getSortedOptions(_this.props).filter(_this._byGroupAndTypedLabel);
        }, _this._clearValue = function () {
            _this.setState({
                value: DEFAULT_VALUE,
                typedLabel: DEFAULT_LABEL,
                isOpen: false,
                highlightedRowIndex: undefined
            }, _this._afterValueChanged(_this.state.value));
        }, _this._isUnknownValue = function () {
            return _this._typedLabelHasText() && !_this._getFilteredOptions().some(function (option) {
                return option.label === _this.state.typedLabel;
            });
        }, _this._fireOnChangeIfSingleOptionWasUpdated = function (prevProps) {
            var _this$props2 = _this.props,
                autoSelectSingleOption = _this$props2.autoSelectSingleOption,
                options = _this$props2.options;

            var haveOptionsChanged = prevProps.options !== options;
            var hasAutoSelectSingleOptionChanged = prevProps.autoSelectSingleOption !== autoSelectSingleOption;
            var shouldFireOnChange = haveOptionsChanged || hasAutoSelectSingleOptionChanged;
            if (shouldFireOnChange && autoSelectSingleOption && options.length === 1) {
                var valueOfSingleOption = options[0].value;
                _this._fireOnChange(valueOfSingleOption);
            }
        }, _this._handleScroll = function () {
            _this._updateMenuOpenDirection();
        }, _this._handleResize = function () {
            _this._updateMenuOpenDirection();
        }, _this._updateMenuOpenDirection = function () {
            var container = _this.elementRefs['container'];
            var options = _this._getFilteredOptions();
            var rows = _this._generateRows(options, _this.props.groups, _this.props, _this._isUnknownValue());

            var totalRowsHeight = _this._calculateTotalRowHeights(rows, _this.props);
            var spacingThreshold = DEFAULT_GROUP_PADDING + DEFAULT_OPTION_HEIGHT;
            var listHeight = _this.props.calculateListHeight(rows, totalRowsHeight) + spacingThreshold;

            var menuTop = container.getBoundingClientRect().top;
            var menuOpenDirection = window.innerHeight < menuTop + listHeight ? MENU_OPEN_DIRECTION_UP : MENU_OPEN_DIRECTION_DOWN;

            if (_this.state.menuOpenDirection !== menuOpenDirection) {
                _this.setState({
                    menuOpenDirection: menuOpenDirection
                });
            }
        }, _this.renderOption = function (option, rowIndex, style) {
            var isHighlighted = typeof _this.state.highlightedRowIndex !== 'undefined' && rowIndex === _this.state.highlightedRowIndex;
            return _react2.default.createElement(
                'div',
                { ref: function ref(element) {
                        return _this.elementRefs['option_' + rowIndex] = element;
                    },
                    key: 'typeahead__option__' + option.value,
                    className: 'typeahead__option',
                    'data-index': rowIndex,
                    'data-value': option.value,
                    'data-highlighted': isHighlighted,
                    'data-group': option.group,
                    style: style,
                    onMouseDown: _this._createHandleOptionMouseDown(option.value, rowIndex) },
                option.label,
                rowIndex === UNKNOWN_VALUE_HIGHLIGHTED ? _this.renderNewOptionMarker() : null
            );
        }, _this.renderGroup = function (group, style) {
            return _react2.default.createElement(
                'div',
                { key: 'typeahead__group__' + group.value, className: 'typeahead__group', 'data-value': group.value,
                    style: style },
                _react2.default.createElement(
                    'div',
                    { className: 'typeahead__group__label' },
                    group.label
                )
            );
        }, _this._generateRows = (0, _memoizeOne2.default)(function (options, groups, props, isUnknownValue) {
            var rows = [];
            if (props.allowUnknownValue && isUnknownValue) {
                rows.push({
                    option: {
                        label: _this.state.typedLabel,
                        value: _this.state.typedLabel
                    },
                    rowIndex: UNKNOWN_VALUE_HIGHLIGHTED
                });
            }
            rows = [].concat((0, _toConsumableArray3.default)(rows), (0, _toConsumableArray3.default)(groups ? _generateGroupedRows(groups, options, props) : _generateOptionRows(options)));
            return rows;
        }), _this._calculateTotalRowHeights = (0, _memoizeOne2.default)(function (rows, props) {
            return rows.reduce(function (totalRowsHeight, row) {
                return totalRowsHeight + (row.group ? props.calculateGroupHeight(row.group, row.rowIndex) : props.calculateOptionHeight(row.option, row.rowIndex));
            }, 0);
        }), _this._createRenderRow = function (rows) {
            return function (_ref2) {
                var rowIndex = _ref2.index,
                    style = _ref2.style;

                var row = rows[rowIndex];
                if (row.option) {
                    return _this.renderOption(row.option, row.rowIndex, style);
                }
                return _this.renderGroup(row.group, style);
            };
        }, _this._createCalculateRowHeight = function (rows) {
            return function (_ref3) {
                var rowIndex = _ref3.index;

                if (rows[rowIndex].group) {
                    return _this.props.calculateGroupHeight(rows[rowIndex].group, rowIndex);
                }
                return _this.props.calculateOptionHeight(rows[rowIndex].option, rowIndex);
            };
        }, _this._createScrollToIndexProp = function () {
            return typeof _this.state.highlightedRowIndex === 'undefined' ? {} : { scrollToIndex: _this.state.highlightedRowIndex };
        }, _this._noRowsRenderer = function () {
            return _this.renderNoOptionsMessage();
        }, _this._estimateMenuWidth = (0, _memoizeOne2.default)(function (estimateMenuWidth, rows) {
            return typeof estimateMenuWidth === 'function' ? estimateMenuWidth(rows) : _estimateMenuWidth(rows);
        }), _this._calculateMenuWidth = function (rows) {
            return _this.props.menuWidth ? _this.props.menuWidth : _this.props.estimateMenuWidth ? _this._estimateMenuWidth(_this.props.estimateMenuWidth, rows) : undefined;
        }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
    }

    (0, _createClass3.default)(Typeahead, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props = this.props,
                autoSelectSingleOption = _props.autoSelectSingleOption,
                options = _props.options;

            if (autoSelectSingleOption && options.length === 1) {
                var valueOfSingleOption = options[0].value;
                this.setState({
                    highlightedRowIndex: 0,
                    value: valueOfSingleOption,
                    typedLabel: Typeahead._getLabelByValue(valueOfSingleOption, this.props.options, this.props.allowUnknownValue)
                });
                this._fireOnChange(valueOfSingleOption);
            }

            this._updateMenuOpenDirection();

            window.addEventListener('scroll', this._handleScroll);
            window.addEventListener('resize', this._handleResize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('scroll', this._handleScroll);
            window.removeEventListener('resize', this._handleResize);
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps) {
            this._fireOnChangeIfSingleOptionWasUpdated(prevProps);
            this._updateMenuOpenDirection();
        }
    }, {
        key: 'renderNoOptionsMessage',
        value: function renderNoOptionsMessage() {
            if (!this.props.allowUnknownValue && this._getFilteredOptions().length === 0 && this.state.typedLabel.length !== 0) {
                return _react2.default.createElement(
                    'div',
                    { className: 'typeahead__no_options' },
                    _react2.default.createElement(
                        'span',
                        { className: 'typeahead__no_options__keyword' },
                        this.state.typedLabel
                    ),
                    '\xA0',
                    this.props.notFoundLabel
                );
            }
        }

        // noinspection JSMethodCanBeStatic

    }, {
        key: 'renderNewOptionMarker',
        value: function renderNewOptionMarker() {
            return _react2.default.createElement(
                'span',
                { className: 'typeahead__option__new_option' },
                ' (+) '
            );
        }
    }, {
        key: 'renderMenu',
        value: function renderMenu() {
            var _this2 = this;

            if (this.state.isOpen) {
                var _rows = this._generateRows(this._getFilteredOptions(), this.props.groups, this.props, this._isUnknownValue());

                var renderRow = this._createRenderRow(_rows);
                var calculateRowHeight = this._createCalculateRowHeight(_rows);
                var scrollToIndexProp = this._createScrollToIndexProp();
                var _totalRowsHeight = this._calculateTotalRowHeights(_rows, this.props);
                var listHeight = this.props.calculateListHeight(_rows, _totalRowsHeight);
                var _menuWidth = this._calculateMenuWidth(_rows);

                var styleProp = _menuWidth ? { style: { width: _menuWidth + 'px' } } : {};

                return _react2.default.createElement(
                    'div',
                    (0, _extends3.default)({
                        ref: function ref(element) {
                            return _this2.elementRefs['menu'] = element;
                        },
                        className: 'typeahead__options',
                        onMouseDown: this._handleListMouseDown,
                        onMouseUp: this._handleListMouseUp
                    }, styleProp),
                    _react2.default.createElement(
                        _AutoSizer2.default,
                        { disableHeight: true },
                        function (_ref4) {
                            var width = _ref4.width;
                            return _react2.default.createElement(_List2.default, (0, _extends3.default)({
                                height: listHeight,
                                width: typeof _menuWidth === 'number' && _menuWidth > width ? _menuWidth : width - AUTO_SIZER_PADDING,
                                rowCount: _rows.length,
                                noRowsRenderer: _this2._noRowsRenderer,
                                rowHeight: calculateRowHeight,
                                rowRenderer: renderRow,
                                tabIndex: null,
                                scrollToAlignment: 'start'
                            }, scrollToIndexProp));
                        }
                    )
                );
            }
        }
    }, {
        key: 'renderClearButton',
        value: function renderClearButton() {
            if (this.props.isClearable && !this.props.isDisabled && this.state.value) {
                return _react2.default.createElement('button', { className: 'typeahead__clear', onClick: this._handleClearClick });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var idProp = this.props.id ? { id: this.props.id } : {};
            var tabIndexProp = this.props.tabIndex ? { tabIndex: this.props.tabIndex } : {};
            var className = this.props.className + ' typeahead--' + this.state.menuOpenDirection;
            return _react2.default.createElement(
                'div',
                { className: className, ref: function ref(element) {
                        return _this3.elementRefs['container'] = element;
                    } },
                _react2.default.createElement('input', (0, _extends3.default)({}, idProp, tabIndexProp, {
                    disabled: this.props.isDisabled,
                    name: this.props.fieldName,
                    onFocus: this._handleInputFocus,
                    onBlur: this._handleInputBlur,
                    onChange: this._handleInputChange,
                    onKeyDown: this._handleInputKeyDown,
                    onMouseDown: this._handleInputMouseDown,
                    placeholder: this.props.placeholder,
                    value: this.state.typedLabel
                })),
                this.renderClearButton(),
                this.renderMenu()
            );
        }
    }], [{
        key: 'getDerivedStateFromProps',
        value: function getDerivedStateFromProps(props, prevState) {
            Typeahead._validateProps(props);

            var options = props.options;

            if (typeof prevState.props === 'undefined' || prevState.props !== props) {
                var shouldAutoSelectSingleOption = props.autoSelectSingleOption && options.length === 1;
                var _highlightedRowIndex = shouldAutoSelectSingleOption ? 0 : Typeahead._getInitialOptionRowIndex(props);
                var _value = shouldAutoSelectSingleOption ? options[0].value : props.value;
                var _typedLabel = Typeahead._getLabelByValue(_value, props.options, props.allowUnknownValue);
                return {
                    highlightedRowIndex: _highlightedRowIndex,
                    value: _value,
                    typedLabel: _typedLabel,
                    props: props
                };
            }
            return null;
        }
    }]);
    return Typeahead;
}(_react.PureComponent);

Typeahead.propTypes = {
    allowUnknownValue: PropTypes.bool,
    autoSelectSingleOption: PropTypes.bool,
    calculateGroupHeight: PropTypes.func,
    calculateListHeight: PropTypes.func,
    calculateOptionHeight: PropTypes.func,
    className: PropTypes.string,
    estimateMenuWidth: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    fieldName: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired
    })),
    id: PropTypes.string,
    isClearable: PropTypes.bool,
    isDisabled: PropTypes.bool,
    menuWidth: PropTypes.number,
    notFoundLabel: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        group: PropTypes.any
    })).isRequired,
    placeholder: PropTypes.string,
    renderEmptyGroups: PropTypes.bool,
    tabIndex: PropTypes.number,
    value: PropTypes.any
};
Typeahead.defaultProps = {
    allowUnknownValue: false,
    autoSelectSingleOption: false,
    calculateGroupHeight: _calculateGroupHeight,
    calculateListHeight: _calculateListHeight,
    calculateOptionHeight: _calculateOptionHeight,
    className: 'typeahead',
    groups: undefined,
    id: undefined,
    isClearable: false,
    isDisabled: false,
    notFoundLabel: DEFAULT_GERMAN_NOT_FOUND_LABEL,
    onBlur: function onBlur() {},
    onChange: function onChange() {},
    options: [],
    placeholder: '',
    renderEmptyGroups: false,
    value: DEFAULT_VALUE
};

Typeahead._getInitialOptionRowIndex = function (props) {
    var options = props.options,
        groups = props.groups,
        value = props.value;


    var isUnknownValue = !props.options.some(function (option) {
        return option.value === props.value;
    });
    if (isUnknownValue && props.allowUnknownValue) {
        return UNKNOWN_VALUE_HIGHLIGHTED;
    }

    var rows = groups ? _generateGroupedRows(groups, options, props) : _generateOptionRows(options);
    var currentRow = _findOptionRow(rows, function (r) {
        return r.option.value === value;
    });
    if (currentRow) {
        return currentRow.rowIndex;
    }

    return NOTHING_HIGHLIGHTED;
};

Typeahead._getLabelByValue = function (value, options, allowUnknownValue) {
    var option = options.find(function (opt) {
        return opt.value === value;
    });
    if (option) {
        return option.label;
    } else if (allowUnknownValue && value !== undefined) {
        return value;
    }
    return DEFAULT_LABEL;
};

Typeahead._validateProps = function (props) {
    var groups = props.groups,
        options = props.options;


    var optionWithoutGroupExists = typeof groups !== 'undefined' && options.some(function (option) {
        return !option.hasOwnProperty('group');
    });

    if (optionWithoutGroupExists) {
        throw new Error('There is at least one option without a group property.');
    }

    var optionWithMissingGroupExists = typeof groups !== 'undefined' && options.some(function (option) {
        return !groups.some(function (group) {
            return group.value === option.group;
        });
    });

    if (optionWithMissingGroupExists) {
        throw new Error('There is at least one option with an unknown group.');
    }
};

exports.default = Typeahead;


function _sortOptionsByGroup(options, groups) {
    if (typeof groups === 'undefined') {
        return options;
    }
    // This is necessary because Array.prototype.sort is not necessarily stable. See:
    // http://www.ecma-international.org/ecma-262/6.0/#sec-array.prototype.sort
    var wrappedOptions = options.map(_wrapOption);
    wrappedOptions.sort(_compareOptions(groups));
    return wrappedOptions.map(_unwrapOption);
}

function _indexOfGroup(groups, groupValue) {
    return groups.findIndex(function (group) {
        return group.value === groupValue;
    });
}

function _wrapOption(option, index) {
    return { option: option, index: index };
}

function _unwrapOption(wrappedOption) {
    return wrappedOption.option;
}

function _compareOptions(groups) {
    return function (wrappedOptionA, wrappedOptionB) {
        var groupComparison = _indexOfGroup(groups, wrappedOptionA.option.group) - _indexOfGroup(groups, wrappedOptionB.option.group);
        return groupComparison === 0 ? wrappedOptionA.index - wrappedOptionB.index : groupComparison;
    };
}

function _calculateGroupHeight(group, rowIndex) {
    return rowIndex > 0 ? DEFAULT_OPTION_HEIGHT + DEFAULT_GROUP_PADDING : DEFAULT_OPTION_HEIGHT;
}

function _calculateListHeight(rows, totalRowsHeight) {
    return rows.length === 0 ? DEFAULT_NO_OPTIONS_HEIGHT : Math.min(totalRowsHeight, DEFAULT_LIST_HEIGHT);
}

function _calculateOptionHeight() {
    return DEFAULT_OPTION_HEIGHT;
}

function _rowWithLongestLabel(longestRow, row) {
    if (!row.option) {
        return longestRow;
    }
    if (!longestRow) {
        return row;
    }
    return row.option.label.length > longestRow.option.label.length ? row : longestRow;
}

function _estimateMenuWidth(rows) {
    var row = rows.reduce(_rowWithLongestLabel, undefined);
    return row ? Math.ceil(row.option.label.length * DEFAULT_ESTIMATED_CHARACTER_WIDTH) : undefined;
}

function _isOptionRow(row) {
    return row.hasOwnProperty('option');
}

function _findLast(array, comparator) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (comparator(array[i])) {
            return array[i];
        }
    }
    return undefined;
}

function _thatExist() {
    return true;
}

function _findOptionRow(rows, comparator) {
    var row = rows.find(function (r) {
        return _isOptionRow(r) && comparator(r);
    });
    return row;
}

function _getOptionRow(rows, comparator) {
    return _findOptionRow(rows, comparator);
}

function _generateGroupedRows(groups, options, props) {
    var rows = [];
    var rowIndex = 0;
    groups.forEach(function (group) {
        var groupOptions = options.filter(function (option) {
            return option.group === group.value;
        });
        if (groupOptions.length > 0 || props.renderEmptyGroups) {
            rows.push({ group: group, rowIndex: rowIndex });
            rowIndex++;
        }
        groupOptions.forEach(function (option) {
            rows.push({
                option: option,
                rowIndex: rowIndex
            });
            rowIndex++;
        });
    });
    return rows;
}

function _generateOptionRows(options) {
    return options.map(function (option, rowIndex) {
        return {
            option: option,
            rowIndex: rowIndex
        };
    });
}