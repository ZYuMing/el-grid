<template>
    <div v-loading="dataLoading">
        <el-table
                :style="tableStyle"
                ref="table"
                v-on="$listeners"
                :data="pageData"
                @sort-change="sortChange"
                v-bind="$attrs"
                sortable="custom">
            <el-table-column
                v-if="showSelection"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column 
                v-if="showExpand"
                type="expand"
            >
                <template slot-scope="props">
                    <slot :row="props.row" name="expand"></slot>
                </template>
            </el-table-column>
            <template
                v-for="(column,index) in columns"
            >
                <headCol :column="column" :key="index" ></headCol>
            </template>
        </el-table>
        <div class="bbar">
            <div class="other">
                 <slot name="bbar"></slot>
            </div>
            <el-pagination
                v-if="showPagingTool"
                class="pagination"
                layout="sizes, prev, pager, next"
                v-on="$listeners"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="currentChange"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Axios from 'axios';
import { Message,Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/table.css';
import 'element-ui/lib/theme-chalk/message.css';
import 'element-ui/lib/theme-chalk/pagination.css';
import 'element-ui/lib/theme-chalk/loading.css'; 
import headCol from './headCol';

export default {
    name: 'IsGrid',
    components: {
        headCol
    },
    data(){
        return {
            dataLoading: false,
            dataSource: [],
            remoteRowData: {},
            sortProp: '',
            sortOrder: '',
            currentPage: 1
        }
    },
    watch:{
        filters(){
            if(this.model=="remote"){
                this.currentPage = 1;
                this.getRmoteData();
            }
        },
        dataLoading(val){
            if(val){
                this.$emit('tableLoading')
            }else{
                this.$emit('tableLoaded')
            }
        }
    },
    computed:{
        // 表格总数据
        tableData(){
            let dataSource
            if(this.model=='local' && this.localData){
                dataSource = this.localData;
            }else{
                dataSource = this.dataSource;
            }
            return dataSource;
        },
        // 表格数据总条目数
        total(){
            let total;
            if(this.model=='remote'){
                total = this.remoteRowData? this.remoteRowData.total : 0;
            }else{
               let fileredData = this.fileredData; 
               total = fileredData.length;
            }
            return total;
        },
        // 经过筛选条件过滤之后的数据
        fileredData(){
            let fileredData = [];
            let tableData = this.tableData;
            if(this.model!="remote"){
                let filters = this.filters;
                let filtersIsEmpty = true
                if (filters.length){
                    for (let i=0,filterFlag = true; i<tableData.length; i++,filterFlag = true){
                        filters.forEach(function(item){
                            if(!filterFlag){
                                return
                            }
                            let name = item.name;
                            let value = item.value;
                            let fn = item.fn;
                            let comparedData;
                            if(value){
                                filtersIsEmpty = false
                            }else{
                                return
                            }
                            if(fn&&value){
                                filterFlag = fn(JSON.parse(JSON.stringify(tableData[i][name])), value)
                            }else{
                                switch(typeof tableData[i][name]){
                                    case 'number':
                                        if (tableData[i][name] == value){
                                            filterFlag = true
                                        }else{
                                            filterFlag = false
                                        }
                                        break
                                    default:
                                        value = value.toString()
                                        if (tableData[i][name].toString().indexOf(value) > -1){
                                            filterFlag = true
                                        }else{
                                            filterFlag = false
                                        }
                                }    
                            }
                        })
                        if(filterFlag){
                            fileredData.push(tableData[i])
                        }
                    }
                }else{
                    fileredData = tableData;
                }
                if(filtersIsEmpty){
                    fileredData = tableData;
                }
            }else{
                fileredData  = tableData;
            }
            
            return fileredData;
        },
        // 当前表格页数展示的数据
        pageData(){
            let pageData;
            let fileredData = JSON.parse(JSON.stringify(this.fileredData));
            let sortProp = this.sortProp;
            let sortOrder = this.sortOrder;
            // 是否有排序
            if (this.model !='remote' && sortProp &&sortOrder){
                fileredData = fileredData.sort(function(prev, now) {
                    let res;
                    if (sortOrder == 'ascending'){
                        if(prev[sortProp] > now[sortProp]){
                            res = 1
                        }else{
                            res = -1
                        }
                    }else{
                        if(now[sortProp] > prev[sortProp]){
                            res = 1
                        }else{
                            res = -1
                        }
                    }
                    return res
                })
            }
            // 是否有分页
            if(this.model =='local' && this.pageSize){
                let currentPage = this.currentPage;
                let pageSize = this.pageSize;
                let start = (currentPage-1)*pageSize;
                let end = currentPage*pageSize;
                pageData = fileredData.slice(start, end);
            }else{
                pageData = fileredData;
            }
            return pageData;
        },
        // 数据来源
        model(){
            let model = (this.tableCfg && this.tableCfg.model) || 'local';
            return model;
        },
        // 数据来源接口地址
        url(){
            let url = this.tableCfg && this.tableCfg.url;
            return url;
        },
        // 每页展示数据数量
        pageSize(){
            let pageSize = (this.tableCfg && this.tableCfg.pageSize) || 30;
            return pageSize;
        },
        // 筛选条件
        filters(){
            let filters = (this.tableCfg && this.tableCfg.filters) || [];
            return filters;
        },
        // 是否显示分页组件
        showPagingTool(){
            let showPagingTool = (this.tableCfg && this.tableCfg.showPagingTool) || false;
            return showPagingTool;
        },
        // 是否显示拓展组件
        showExpand(){
            let showExpand = (this.tableCfg && this.tableCfg.showExpand) || false;
            return showExpand;
        },
        // 是否显示勾选框
        showSelection() {
            let showSelection = (this.tableCfg && this.tableCfg.showSelection) || false;
            return showSelection;
        },
        // 外部加载数据
        localData(){
            let localData = (this.tableCfg && this.tableCfg.data) || false;
            return localData;
        },
        // 表格列数据
        columns(){
            let columns = (this.tableCfg && this.tableCfg.columns) || [];
            // columns.unshift(columns.pop())
            return columns;
        },
        // 表格样式
        tableStyle(){
            let tableStyle = (this.tableCfg && this.tableCfg.tableStyle) || '';
            return tableStyle;
        },
        // 表格样式
        params(){
            let params = (this.tableCfg && this.tableCfg.params) || {};
            return params;
        },
        tableCfg(){
            return  this.config
        }
    },
    props: {
        config: {
            type: Object
        },
        tableCfgRaw: {
            type: Object
        },
    },
    mounted(){
        let url = this.url;
        if(url){
            this.getRmoteData();
        }
    },
    methods: {
        // 获取props转义值
        getProps(){
            let props = {};
            let columns = JSON.parse(JSON.stringify(this.tableCfg.columns));
            for(let i=0; i<columns.length; i++){
                if(columns[i].prop){
                    props[columns[i].prop] = columns[i].label;
                }
            }
            return props;
        },
        // 是否是多表头
        isMulColumn(col){
            let isMulColumn;
            if(col.childrens && col.childrens.length){
                isMulColumn = true
            }else{
                isMulColumn = false
            }
            return isMulColumn
        },
        reload(){
            this.getRmoteData()
        },
        getRmoteData(getAllData){
            let url = this.url;
            let param = this.params;
            // 服务端筛选
            if (!getAllData && this.model=='remote'){
                param= Object.assign(param, {
                    limit: this.pageSize,
                    offset: (this.currentPage-1)*this.pageSize >0 ? ((this.currentPage-1)*this.pageSize)-1 : (this.currentPage-1)*this.pageSize,
                    // filters: this.filters
                })
                this.filters.forEach(function(item){
                    if(item.value){
                        param[item.name] = item.value
                    }else{
                        delete param[item.name]
                    }
                })
            }
            if(!getAllData){
                this.dataLoading = true;
            }
            return new Promise((resolve, reject) =>{
                Axios.post(url,param)
                .then((res) => {
                    let status = res.status;
                    let data = res.data;

                    if(!getAllData){
                        this.dataLoading = false;
                        this.remoteRowData = data.result;
                    }
                    if (status != 200 || res.data.code!=0){
                        Message.error('拉取表格数据失败');
                    }else{
                        if(!getAllData){
                            this.dataSource = data.result.list || [];
                        }else{
                            resolve(data.result.list || []);
                        }
                    }
                })
                .catch( (error) => {
                    this.dataLoading = false;
                    Message.error('拉取表格数据失败');
                })
                .finally( () => {
                    this.dataLoading = false;
                })
            })
           
        },
        // 排序
        sortChange({column, prop, order}){
            this.sortProp = prop;
            this.sortOrder = order;
            if(this.model=="remote"){
                this.getRmoteData()
            }
        },
        // 页数切换
        currentChange(page){
            this.currentPage = page;
            if(this.model=="remote"){
                this.getRmoteData()
            }
        },
        setCurrentRow(row) {
            this.$refs.table.setCurrentRow(row);
        },
    }
};
</script>
<style lang="postcss" scoped>
    .bbar{
        background: #fff;
        height: 62px;
        display: flex; 
    }
    .bbar .pagination{
        margin-top: 10px;
    }
    .bbar .other{
        flex: 1;
    }
</style>
