<template>
    <el-table-column
        :sortable="column.sortable ? 'custom': false"
        :prop="column.prop"
        :fixed="column.fixed"
        :label="column.label"
        :width="column.width"
    >
        <template v-if="!isMulColumn" slot-scope="scope">
            <div v-if="column.render">
                <cell-render 
                    :column="column" 
                    :row="scope.row" 
                    :render="column.render"
                ></cell-render>
            </div>
            <div v-else>
                {{scope.row[column.prop]}}
            </div>
        </template>
        <template v-else>
            <headCol 
                v-for="(itemcol,index) in column.childrens" 
                :key="index" 
                :column="itemcol" 
                :index="scope.$index"
            ></headCol>
        </template>
    </el-table-column>
</template>

<script>
import { ElTableColumn } from 'element-ui'
import cellRender from './cellRender'
export default {
    components: {
        cellRender
    },
    name: 'headCol',
    props: ['column'],
    computed:{
        isMulColumn(){
            let col = this.column
            let isMulColumn;
            if(col.childrens && col.childrens.length){
                isMulColumn = true
            }else{
                isMulColumn = false
            }
            return isMulColumn
        }
    }
}
</script>
<style scope>
    .headerWrapper{
        float: left;
        line-height: 1;
    }
</style>
