(function () {
    var filterSelect = function (ele, opt) {
        this.$el = ele;
        this.default = {
            data: [],
            value: this.$el.val()
        };
        this.option = $.extend({}, this.default, opt);
    };
    filterSelect.prototype = {
        init() {
            var list = this.option.data;
            var html = '<span class="select"></span><div class="container"><input class="select-input" type="text" class="block"> <ul class="container-list">';
            list.forEach(function (item) {
                if (item.value == this.option.value) {
                    this.setSelect(item.value, item.label)
                    html += '<li class="container-item current-select" value="' + item.value + '">' + item.label + '</li>'
                }
                html += '<li class="container-item" value="' + item.value + '">' + item.label + '</li>'
            }.bind(this))
            html += '</ul></div>'
            this.$el.after(html);
            this.$el.parent().find('.select').on('click', function () {
                this.trigger()
            }.bind(this))
            this.$el.parent().find('.select-input').on('input', function (e) {
                this.filter(e.target.value)
            }.bind(this))
            $('.container-item').on('click', function (e) {
                this.setSelect(e.target.value, e.target.innerText)
            }.bind(this))

        },
        trigger() {
            var container = this.$el.parent().find('.container');
            container.css('display', container.css('display') === 'block' ? 'none' : 'block')
        },
        filter(string) {
            var list = $('.container-item');
            $.makeArray(list).forEach(function (item) {
                if (string === '') {
                    list.css('display', 'block')
                } else {
                    if (item.innerText.indexOf(string) !== -1) {
                        $(item).css('display', 'block')
                    } else {
                        $(item).css('display', 'none')
                    }
                }
            })
        },
        setSelect(val, text) {
            $('.select').text(text);
            this.$el.val(val);
            // this.trigger()
        }
    };

    $.fn.filterSelect = function (option) {
        var obj = new filterSelect(this, option);
        return obj.init();
    }
})()