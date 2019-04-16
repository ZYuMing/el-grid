## Grid 表格

在支持el-table组件已有功能的基础上集成了排序，筛选，分页，请求服务端数据等功能，具有更好的拓展性。

待完成
增加导出功能

### 参数
| 参数			  | 说明              		| 类型      | 可选值   		| 默认值  |
|----------		 |--------------           |---------- |------------- |-------- |
| mode          | 加载数据的方式           | String 	| local/remote | local   |
| url            | 服务端数据接口url        | String 	| — 			| — 	 |
| columns        | 表格每列数据的显示配置    | Srray 	| — 			| — 	  |
| showPagingTool | 是否显示分页组件 		| Boolean 	| — 			| false  |
| size			 | 每页显示条数 			| Number 	| — 			| -   	|
| showSelection  | 是否显示表格选择框 		| Boolean 	| — 			| false   |

### 用法
#### 基础用法。
>在配置`data`与`columns`属性后即可正常展示数据
```html
    <template>
        <div>
            <el-grid width="500" :config="tableCfg" :data="data"></el-grid>
        </div>      
    </template>

    <script>
        export default {
            data(){
                return{
                    data: [
                        {
                            date: '2016-05-02',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1518 弄'
                        }, 
                        {
                            date: '2016-05-04',
                            name: '王小虎',
                            address:  '上海市普陀区金沙江路 1517 弄'
                        },
                        {
                            date: '2016-05-03',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        }
                    ],
                    tableCfg:{
                        columns:[
                            {
                                prop: 'name',   
                                label: '姓名'
                            },
                            {
                                prop: 'date',  
                                label: '日期'
                            },
                            {
                                prop: 'address',  
                                label: '地址'
                            }
                        ]
                    }
                }
            }
        }
    </script>
```

### 加载服务端数据

>需要配置`url`与`mode`属性，`url`表示拉取数据的url地址。
```html
<template>
    <div>
        <el-grid width="500" :config="tableCfg" ></el-grid>
    </div>      
</template>

<script>
    export default {
        data(){
            return{
                tableCfg:{
                    pageSize: 5,
                    mode: 'local',
                    url:'https://easy-mock.com/mock/5cb2c5708185550e7d51c038/example/getList',
                    columns:[
                        {
                            prop: 'name',   
                            label: '姓名'
                        },
                        {
                            prop: 'date',  
                            label: '日期'
                        },
                        {
                            prop: 'address',  
                            label: '地址'
                        }
                    ]
                }
            }
        }
    }
</script>
```
