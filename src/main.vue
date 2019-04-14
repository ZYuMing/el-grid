<template>
    <div v-loading="dataLoading">
        <el-table
            :style="tableStyle"
            ref="table"
            v-on="$listeners"
            :data="pageData"
            @sort-change="sortChange"
            v-bind="$attrs"
            sortable="custom"
        >
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
            <template v-for="(column,index) in columns">
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
                layout="prev, pager, next"
                v-on="$listeners"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="currentChange"
                @size-change="sizeChange"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
import { Message,Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/table.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/pagination.css'
import 'element-ui/lib/theme-chalk/loading.css' 
import headCol from './headCol'
import util from './util'
export default {
    name: 'ElGrid',
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
            currentPage: 1,
            params: {}
        }
    },
    watch:{
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
            if(this.mode=='local' && this.localData){
                dataSource = util.deepCopy(this.localData)
            }else{
                dataSource = util.deepCopy(this.dataSource)
            }
            if(this.mode=='local' && this.sortProp){
                let that = this
                dataSource = dataSource.sort((a,b)=>{
                    let prev
                    let next
                    if(that.sortOrder == 'desc'){
                        prev = a
                        next = b
                    }else{
                        prev = b
                        next = a
                    }
                    if(prev[this.sortProp]>next[this.sortProp]){
                        return 1
                    }else{
                        return -1
                    }
                })
            }
            return dataSource
        },
        // 表格数据总条目数
        total(){
            let total
            if(this.mode=='remote'){
                total = this.remoteRowData? this.remoteRowData.total : 0
            }else{
               let tableData = this.tableData 
               total = tableData.length
            }
            return total
        },
        // 当前表格页数展示的数据
        pageData(){
            let pageData
            let tableData = util.deepCopy(this.tableData)
            let sortProp = this.sortProp
            let sortOrder = this.sortOrder
            // 是否有分页
            if(this.mode =='local' && this.pageSize){
                let currentPage = this.currentPage
                let pageSize = this.pageSize
                let start = (currentPage-1)*pageSize
                let end = currentPage*pageSize
                pageData = tableData.slice(start, end)
            }else{
                pageData = tableData
            }
            return pageData
        },
        // 数据来源
        mode(){
            let mode = (this.tableCfg && this.tableCfg.mode) || 'local'
            return mode
        },
        // 数据来源接口地址
        url(){
            let url = this.tableCfg && this.tableCfg.url
            return url
        },
        // 每页展示数据数量
        pageSize(){
            let pageSize = (this.tableCfg && this.tableCfg.pageSize) || 30
            return pageSize
        },
        // 是否显示分页组件
        showPagingTool(){
            let showPagingTool = (this.tableCfg && this.tableCfg.showPagingTool) || false
            return showPagingTool
        },
        // 是否显示拓展组件
        showExpand(){
            let showExpand = (this.tableCfg && this.tableCfg.showExpand) || false
            return showExpand
        },
        // 是否显示勾选框
        showSelection() {
            let showSelection = (this.tableCfg && this.tableCfg.showSelection) || false
            return showSelection
        },
        // 外部传入的数据
        localData(){
            let localData = (this.tableCfg && this.tableCfg.data) || false
            return localData
        },
        // 表格列数据
        columns(){
            let columns = (this.tableCfg && this.tableCfg.columns) || []
            return columns
        },
        // 表格样式
        tableStyle(){
            let tableStyle = (this.tableCfg && this.tableCfg.tableStyle) || ''
            return tableStyle
        },
        // 表格样式
        staticParams(){
            let params = (this.tableCfg && this.tableCfg.params) || {}
            return params
        },
        tableCfg(){
            return this.config
        }
    },
    props: {
        config: {
            type: Object
        }
    },
    mounted(){
        let url = this.url
        if(url){
            this.getRmoteData()
        }
    },
    methods: {
        // 获取props转义值
        getProps(){
            let props = {}
            let columns = util.deepCopy(this.tableCfg.columns)
            for(let i=0; i<columns.length; i++){
                if(columns[i].prop){
                    props[columns[i].prop] = columns[i].label
                }
            }
            return props
        },
        // 是否是多表头
        isMulColumn(col){
            let isMulColumn
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
        getRmoteData(){
            let url = this.url
            let param = this.staticParams
            // 服务端筛选
            if (this.mode=='remote'){
                param = Object.assign(param, {
                    limit: this.pageSize,
                    offset: ((this.currentPage-1)*this.pageSize)
                })
                if(util.isEmpty(this.params)){
                    param = Object.assign(param, this.params)
                }
                if(this.sortProp){
                    param['sort'] = {
                        key: this.sortProp,
                        value: this.sortOrder
                    }
                }
            }
            this.dataLoading = true
            return new Promise((resolve, reject) =>{
                Axios.post(url,param)
                .then((res) => {
                    let status = res.status
                    let data = res.data
                    this.remoteRowData = data
                    if (status != 200){
                        Message.error('拉取表格数据失败')
                    }else{
                        this.dataSource = data.list || []
                        resolve(data.list)
                    }
                })
                .catch( (error) => {
                    this.dataLoading = false
                    Message.error('拉取表格数据失败')
                })
                .finally( () => {
                    this.dataLoading = false
                })
            })
           
        },
        // 排序
        sortChange({column, prop, order}){
            if(order == 'descending'){
                order = 'desc'
            }else{
                order = 'asc'
            }
            this.sortProp = prop
            this.sortOrder = order
            if(this.mode=="remote"){
                this.getRmoteData()
            }else{

            }
        },
        // 页数切换
        currentChange(page){
            this.currentPage = page
            if(this.mode=="remote"){
                this.getRmoteData()
            }
        },
        sizeChange(size){

        },
        setCurrentRow(row) {
            this.$refs.table.setCurrentRow(row)
        },
        // 搜索
        filter(params){
            this.params = params
        }
    }
}
</script>
<style scoped>
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
