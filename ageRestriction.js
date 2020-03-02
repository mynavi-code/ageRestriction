/**
AgeRestriction.js v1
年齢制限をするためのライブラリ

Copyright (c) 2020 YamamotoKoshiro
Released under the MIT license
https://github.com/Microsoft/MixedRealityToolkit-Unity/blob/master/License.txt

使い方
1.このライブラリをダウンロードし、該当ページにてインポートしてください（例）<script src="ageRestriction.js"></script>
2.インスタンスを生成してください（例）new AgeRestriction(18, 65, 'year', 'month', 'day');
第1引数：下限年齢
第2引数：上限年齢
第3引数：年select要素のid属性
第4引数：月select要素のid属性
第5引数：日select要素のid属性
*/

class AgeRestriction {

    constructor(minAge, maxAge, yearId, monthId, dayId) {
        this.minAge = minAge;
        // 最大年齢では無くなる日までを計算するため
        this.maxAge = maxAge + 1;
        this.nowDate = new Date();
        this.nowYear = this.nowDate.getFullYear();
        this.nowMonth = this.nowDate.getMonth() + 1;
        this.nowDay = this.nowDate.getDate();
        this.yearObj = document.getElementById(yearId);
        this.monthObj = document.getElementById(monthId);
        this.dayObj = document.getElementById(dayId);
        this.year;
        this.month;
        this.age;
        this.firstMonth;
        this.lastMonth;
        this.firstDay;
        this.lastDay;

        this.init(this);
    }

    // 年 セット
    setYear() {
        this.year = this.yearObj.value;
    }

    // 月 セット
    setMonth() {
        this.month = this.monthObj.value;
    }

    // 年齢 セット
    setAge() {
        this.age = this.nowYear - this.year;
    }

    // 年描画
    outputYear() {
        let option = '';
        for (let i = this.nowYear - this.minAge; i >= this.nowYear - this.maxAge; i--) {
            option += '<option value="' + i + '">' + i + '</option>\n';
        }
        this.yearObj.innerHTML = option;
    }

    // ループ月　セット
    setFirstLastMonth() {
        this.setYear();
        this.setAge();
        this.firstMonth = 1;
        this.endMonth = 12;
        if (this.age == this.minAge) {
            this.endMonth = this.nowMonth;
        } else if (this.age == this.maxAge) {
            this.firstMonth = this.nowMonth;
        }
    }

    // 月描画
    outputMonth() {
        this.setFirstLastMonth();
        let option = '';
        for (let i = this.firstMonth; i <= this.endMonth; i++) {
            option += '<option value="' + i + '">' + i + '</option>\n';
        }
        this.monthObj.innerHTML = option;
    }

    // ループ日付 セット
    setFirstLastDay() {
        this.setYear();
        this.setMonth();
        let monthLastday = ['', 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.leapYearCheck(this.year)) {
            monthLastday[2] = 29;
        }
        this.lastDay = monthLastday[this.month];
        this.firstDay = 1;
        this.setAge();
        if (this.age == this.minAge && this.month == this.nowMonth) {
            this.lastDay = this.nowDay;
            //うるう年計算
            if (this.nowMonth == 2 && this.lastDay == 29) {    
                if (!this.leapYearCheck(this.year)) {
                    this.lastDay = 28;
                }
            }
        } else if (this.age == this.maxAge && this.month == this.nowMonth) {
            // 最大年齢では無くなる日までを計算するため 
            this.firstDay = this.nowDay + 1;
        }
    }

    // 日付描画 
    outputDay() {
        this.setFirstLastDay();
        let option = '';
        for (let i = this.firstDay; i <= this.lastDay; i++) {
            option += '<option value="' + i + '">' + i + '</option>\n';
        }
        this.dayObj.innerHTML = option;
    }

    // うるう年計算
    leapYearCheck(year) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true
        }
        return false;
    }

    // イベントセット
    init(obj) {
        obj.outputYear();
        obj.outputMonth();
        obj.outputDay();
        obj.yearObj.addEventListener('change', function () {
            obj.outputMonth();
            obj.outputDay();
        });
        obj.monthObj.addEventListener('change', function () {
            obj.outputDay();
        });
    }
}
