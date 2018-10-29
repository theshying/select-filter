(function () {
    var filterSelect = function (ele, opt) {
        this.$el = ele;
        this.default = {
            //下拉数据
            data: [],
            //默认选中值
            defaultValue: 1,
            //单选或复选（'radio' || 'checkbox'）
            type: 'radio',
            noItemMsg: '无数据',
            //默认展开下拉
            open: false,
            onfocus: false,
            callback: {
                selected: function () { },
            },

        };
        this.option = $.extend({}, this.default, opt);
    };
    filterSelect.prototype = {
        //初始化
        init() {
            //渲染下拉列表
            var list = this.option.data;
            var html = '<div class="drop-down__container"><ul class="container-list__all">';
            list.forEach(function (item) {
             
                if (item.value == this.option.defaultValue) {
                    //默认选中样式设置
                    html += '<li class="container-list__item current-select" value="' + item.value + '">' + item.label + '</li>'
                    //默认选中input text补全
                    this.$el.val(item.label)
                } else {
                    html += '<li class="container-list__item" value="' + item.value + '">' + item.label + '</li>'
                }
             
            }.bind(this))
            html += '</ul></div>'
            //插入下拉列表
            this.$el.after(html);
            //默认展开
            this.option.open && this.triggerSelectList(true);
            //onfocus
            this.option.onfocus && this.$el.focus();
            this.eventRegister()
        },
        //事件绑定
        eventRegister() {
            const _this = this
             //下拉列表选中事件（即某个select list被单击）
             //使用mousedown替换click事件，避免和blur事件冲突，也可以延迟this.$el的blur事件的执行来解决此问题
             this.$el.next().on('mousedown', function (e) {
                
                if (e.target.tagName === 'LI') {
                    //触发选中回调
                    _this.option.callback.selected({
                        value: e.target.value,
                        name: e.target.innerText,
                    })
                    //关闭下拉
                    _this.triggerSelectList(false)
                    //设置input显示选中的label
                    _this.$el.val(e.target.innerText)
                }
            })
            //input 焦点则展开下拉
            this.$el.on({
                //input focus, 展开下拉
                focus: function() {
                    _this.triggerSelectList(true)
                },
                //input blur，则关闭下拉
                // blur: function(e) {
                //     _this.triggerSelectList(false);
                // },
                //input ,则过滤条目
                input: function(e) {
                    _this.filterSelectList(e.target.value)
                }
            })
            //绑定键盘事件
            this.$el.parent().on('keydown', function (e) {
                //默认选中的下拉
                let defaultSelect = _this.$el.next().find('.list-item__hover');
                //下拉列表中的元素
                const selectItems = _this.$el.next().find('.container-list__item');
                //记录光标移动的元素
                const keyCode = e.keyCode;
                //向下
                if (keyCode === 40) {
                    const nextItem = defaultSelect.next();
                    defaultSelect.removeClass('list-item__hover');
                    console.log(nextItem)
                    if (nextItem && nextItem[0]) {
                        nextItem.addClass('list-item__hover');
                    } else {
                        //跳转到第一个
                        $(selectItems[0]).addClass('list-item__hover')
                    }
                }
                //向下
                if (keyCode === 38) {
                    //默认选中的下拉
                    let prevItem = defaultSelect.prev();
                    //下拉列表中的最后一个元素
                    const lastSelect = selectItems[selectItems.length - 1]
                    defaultSelect.removeClass('list-item__hover');
                    if (prevItem && prevItem[0]) {
                        prevItem.addClass('list-item__hover');
                    } else {
                        //跳转到第一个
                        $(lastSelect).addClass('list-item__hover')
                    }
                }
                //回车
                if (keyCode === 13) {
                    var data = {
                        value: defaultSelect[0].value,
                        name: defaultSelect[0].innerText,
                    }
                    _this.option.callback.selected(data);
                        //设置input显示选中的label
                    _this.$el.val(data.name);
                       //关闭下拉
                    _this.triggerSelectList(false)
                }
            })
        },
        //显示或者隐藏下拉列表
        triggerSelectList(show) {
            let display = 'none';
            const el = this.$el;
            if (show == undefined) {
                display = el.next().css('display') === 'block' ? 'none' : 'block';
            } else {
                display = show === true ? 'block' : 'none'
            }
            el.next().css('display', display)
        },
        filterSelectList(string) {
            this.triggerSelectList(true);
            //下拉元素集合
            const el = this.$el.next().find('.container-list__item');
            //遍历当前下拉,和传入的string做比较
            //标记被过滤的次数
            let count = 0;
            $.makeArray(el).forEach(function (item) {
                if (string === '') {
                    el.css('display', 'block');
                } else {
                    if (item.innerText.indexOf(string) !== -1) {
                        $(item).css('display', 'block');
                    } else {
                        $(item).css('display', 'none');
                        count ++;
                    }
                }
            });
            const isAppend = this.$el.next().find('#noneMsg');
            if (count === el.length && isAppend.length === 0) {
                this.$el.next().find('.container-list__all').append('<li class="none-filter__item" id="noneMsg">' + this.default.noItemMsg + '</li>')
            } else  {
                isAppend.remove()
            }
        },
    };

    $.fn.filterSelect = function (option) {
        var obj = new filterSelect(this, option);
        return obj.init();
    }
})()