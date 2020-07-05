<template>
  <div class="main">
    <h1>Expenses</h1>
    <div>
    <el-col :span="8">
          <el-date-picker
            v-model="searchdate"
            type="date"
            placeholder="Pick a day"
            :picker-options="pickerOptions"
            @change="search($event)">
          </el-date-picker>
        </el-col>
    </div>
    <div v-if="isEmpty">
      <el-alert
        title="There are no expenses at this moment"
        type="info"
        :center="true"
        show-icon
        :closable="false">
      </el-alert>
      </div>
      <div v-else>
        <el-table
          :data="activities"
          >
          <el-table-column
            prop="name"
            label="Name">
          </el-table-column>
          <el-table-column
            prop="amt"
            label="AMount">
          </el-table-column>
          <el-table-column
            label="Date">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{getDate(scope.row.date)}}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="Remove">
            <template slot-scope="scope">
              <el-button type="danger"
                icon="el-icon-delete"
                @click="removeActivity(scope.row)" 
                circle
                size="small">
              </el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div>
      <el-row type="flex" justify="center" class="counterSection">

        <el-col :span="3">
          Total :
        </el-col>
        <el-col :span="2">
          {{total}}
        </el-col>
        <el-col :span="3">
          TotalExpenses :
        </el-col>
        <el-col :span="2">
          {{totalExpenseVal}}
        </el-col>
      </el-row>
    </div>
    <div v-if="isWrongActivity" class="wrongNotification">
      <el-alert
        :title="errorMessage"
        type="error"
        :center="true"
        show-icon
        :closable="false">
      </el-alert>
    </div>

    <div>
      <el-row>
        <el-col :span="3">
         Expense:
        </el-col>

        <el-col :span="8">
          <el-input 
            placeholder="Please input the activity"
            v-model="activity" 
            size="mini">
          </el-input>
        </el-col>
        <el-col :span="3">
          Amount:
        </el-col>

        <el-col :span="8">
          <el-input type="number"
            placeholder="Please input the amount"
            v-model="amount"
            size="mini">
          </el-input>
        </el-col>
        <el-col :span="3">
          Date:
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Pick a day">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-button 
        type="primary"
        icon="el-icon-circle-plus-outline"
        circle
        @click="addActivityMethod()">
      </el-button>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import moment from 'moment'
  import { v4 as uuidv4 } from 'uuid'

  export default {
    name: 'Activity',
    data() {
      return {
        activity: '',
        wrong: false,
        amount: '',
        date: '',
        errorMessage: '',
        searchdate: '',
        pickerOptions: {
            shortcuts: [{
            text: 'Today',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: 'Yesterday',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: 'A week ago',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }, {
            text: 'A month ago',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }],
        }
      }
    },
    computed: {
      ...mapGetters({
        'activities': 'getActivities',
        'totalExpense': 'getTotal'
      }),
      isWrongActivity() {
        return this.wrong
      },
      total() {
        const len = this.activities.length;
        return len
      },
      isEmpty() {
        return this.activities.length === 0;
      },
      totalExpenseVal() {
        return this.totalExpense
      }
    },
    methods: {
      ...mapActions(['addActivity', 'deleteActivity','searchActivity']),
      addActivityMethod() {
        if (this.validateData() === true) {
          const activity = {
            name: this.activity,

            amt: this.amount,
            date: this.date,
            id: uuidv4()
          };
          this.addActivity({activity});
          this.activity = '';
          this.date = '';
          this.amount='';
          this.wrong = false;
        } else {
          this.wrong = true;
          this.setMessageError();
        }
      },
      removeActivity(item) {
        this.deleteActivity({activity: item})
      },
      validateData() {
        if (this.activity !== '' && this.date !== '' && this.amount !== '') {
          return true;
        } else {
          return false;
        }
      },
      setMessageError() {
        if (this.activity === '' && this.date === '' && this.amount === '') {
          this.errorMessage = 'The activity && the date && amount are empty';
        } else {
          if (this.activity === '') {
            this.errorMessage = 'The activity is empty';
          } else if (this.amt === '') {
            this.errorMessage = 'The amount is empty';
          } else{
          this.errorMessage = 'The date is empty';
          }

        }
      },
      search(){
        console.log(this.searchdate);
        this.searchActivity(this.searchdate);
      },
      getDate (item) {
        return moment(item).format('DD/MM/YYYY')
      }
    }
  }
</script>

<style>
.main {
  text-align: center;
}
.wrongNotification {
  margin-bottom: 0.2rem;
  width: 80%;
  margin-left: 10%;
  text-align: center
}
div.cell {
  text-align: center;
}
.counterSection {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.el-table .warning-row {
  background: oldlace;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>