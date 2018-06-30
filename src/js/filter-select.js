(function () {
    var filterSelect = function (ele, opt) {
        this.$el = ele;
        this.default = {
            //下拉数据
            data: [],
            //默认选中值
            value: '',
            //单选或复选（'radio' || 'checkbox'）
            type: 'radio',
            placeholder: '请选择',
            callback: {
                selected: function(){},
            },

        };
        this.option = $.extend({}, this.default, opt);
    };
    filterSelect.prototype = {
        //初始化
        init() {
            this.$el.text(this.option.placeholder);
            var list = this.option.data;
            var html = '<div class="drop-down__container"><input class="container-search__input" type="text" class="block"> <ul class="container-list__all">';
            list.forEach(function (item) {
                if (item.value == this.option.value) {
                    this.setSelect(item.label)
                    html += '<li class="container-list__item current-select" value="' + item.value + '">' + item.label + '</li>'
                }
                html += '<li class="container-list__item" value="' + item.value + '">' + item.label + '</li>'
            }.bind(this))
            html += '</ul></div>'
            this.$el.after(html);
            this.getElement();
            this.defaultSelect = this.$els.select_el;
            this.eventRegister();
        },
        //获取dom元素
        getElement() {
            var el = this.$el.parent().children();
            this.$els = {
                //选中元素显示区域
                content_el:$(el[0]),
                //下拉列表容器
                container_el:$(el[1]),
                // 下拉列表元素
                list_els:$(el[1]).children().children(),
                // 检索框
                search_el: $(el[1]).children('.container-search__input'),
                //当前选中元素
                select_el: $('.current-select')
            }
        },
        //事件绑定
        eventRegister() {
            this.$els.content_el.on('click', function () {
                this.trigger();
                this.$els.search_el.trigger('focus')
            }.bind(this))
             this.$els.search_el.on('input', function (e) {
                 this.filter(e.target.value)
             }.bind(this))
            this.$els.list_els.on('click', function (e) {
                 this.option.callback.selected({
                     value: e.target.value,
                     name: e.target.innerText,
                 })
                 this.setSelect(e.target.innerText)
                 this.trigger(false)
             }.bind(this))
             this.$els.container_el.on('keydown', function(e) {
                 var defaultSelect =$( this.defaultSelect);
                 var next = defaultSelect.next();
                 var prev = defaultSelect.prev();
                 var keyCode = e.keyCode;
                 //向下
                 if(keyCode === 40 &&  next.length > 0 ) {
                    defaultSelect.removeClass('current-select');
                    this.defaultSelect =  next;
                    next.addClass('current-select');
                    return;
                     //向上.
                 } else if (keyCode === 38 && prev.length > 0) {
                    defaultSelect.removeClass('current-select');
                    this.defaultSelect =  prev;
                    prev.addClass('current-select');
                    return;
                     //回车
                 } else if (keyCode === 13) {
                     var data = {
                         value : this.defaultSelect[0].value,
                         name : this.defaultSelect[0].innerText,
                     }
                     this.setSelect(data.name)
                     this.option.callback.selected(data);
                 }
             }.bind(this))
        },
        trigger(show) {
            var display = null
            if (show === undefined) {
                display = this.$els.container_el.css('display') === 'block' ?  'none' : 'block';
            } else {
                display = show === true ? 'block' : 'none'
            }
            this.$els.container_el.css('display', display)
        },
        filter(string) {
          var el =this.$els.list_els
            $.makeArray(el).forEach(function (item) {
                if (string === '') {
                    el.css('display', 'block')
                } else {
                    if (item.innerText.indexOf(string) !== -1) {
                        $(item).css('display', 'block')
                    } else {
                        $(item).css('display', 'none')
                    }
                }
            })
        },
        setSelect(name) {
            this.$el.text(name);
        }
    };

    $.fn.filterSelect = function (option) {
        var obj = new filterSelect(this, option);
        return obj.init();
    }
})()