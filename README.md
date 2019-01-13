## Grid 表格(未完成)

在el-table表格的基础上添加了排序，筛选，分页等功能

### 基础表格

基础的表格展示用法。

:::demo  在`config`对象中配置`data`与`columns`属性后即可正常展示数据
```html
<template>
    <div>
        <is-grid width="500" :config="tableCfg" ></is-grid>
    </div>      
</template>

<script>
    export default {
        data(){
            return{
                tableCfg:{
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
:::

### 分页功能

:::demo 需要在`config`对象中配置`pageSize`与`showPagingTool`属性。`pageSize`接受一个`Number`值，表示表格每页显示条目个数。`showPagingTool`接受一个`Boolean`值，表示是否显示分页操作栏
```html
<template>
    <div>
        <is-grid width="500" :config="tableCfg1" ></is-grid>
    </div>      
</template>

<script>
    export default {
        data(){
            return{
                tableCfg1:{
                    pageSize: 4,
                    showPagingTool: true,
                    data: [
                        {
                            date: '2016-05-01',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1518 弄'
                        }, 
                        {
                            date: '2016-05-02',
                            name: '王小虎',
                            address:  '上海市普陀区金沙江路 1517 弄'
                        },
                        {
                            date: '2016-05-03',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-04',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-05',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-06',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-07',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-08',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-09',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        }
                    ],
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
:::

### 加载服务端数据

:::demo 需要配置`url`与`model`属性，`url`表示拉取数据的url地址。`model`表示数据加载的方式，默认为`local`(本地数据)，可以设置为`remote`(服务端数据)。当配置了`url`值且`model`为`local`时，则表示从拉取数据后分页、筛选、排序操作都在本地进行。当配置了`url`值且`model`为`remote`时，则表示后续分页、筛选、排序操作都在服务端进行
```html
<template>
    <div>
        <is-grid width="500" :config="tableCfg2" ></is-grid>
    </div>      
</template>

<script>
    export default {
        data(){
            return{
                tableCfg2:{
                    pageSize: 5,
                    model: 'local',
                    url: 'http://xxxx',
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
:::

### 筛选数据

:::demo 需要配置`url`与`model`属性，`url`表示拉取数据的url地址。`model`表示数据加载的方式，默认为`local`(本地数据)，可以设置为`remote`(服务端数据)。当配置了`url`值且`model`为`local`时，则表示从拉取数据后分页、筛选、排序操作都在本地进行。当配置了`url`值且`model`为`remote`时，则表示后续分页、筛选、排序操作都在服务端进行
```html
<template>
    <div>
        <el-input class="nameIpt"  v-model="input" placeholder="搜索名字"></el-input>
        <is-grid width="500" :config="tableCfg3" ></is-grid>
    </div>      
</template>

<script>
    export default {
        data(){
            return{
                tableCfg3:{
                    input: '',
                    pageSize: 4,
                    showPagingTool: true,
                    data: [
                        {
                            date: '2016-05-01',
                            name: '王小胖',
                            address: '上海市普陀区金沙江路 1518 弄'
                        }, 
                        {
                            date: '2016-05-02',
                            name: '王小瘦',
                            address:  '上海市普陀区金沙江路 1517 弄'
                        },
                        {
                            date: '2016-05-03',
                            name: '王小虎',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-04',
                            name: '王小壮',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-05',
                            name: '王小高',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-06',
                            name: '王小矮',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-07',
                            name: '王小肥',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-08',
                            name: '王小富',
                            address: '上海市普陀区金沙江路 1516 弄'
                        },
                        {
                            date: '2016-05-09',
                            name: '王小穷',
                            address: '上海市普陀区金沙江路 1516 弄'
                        }
                    ],
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
                    ],
                    filter:[
                        {
                            name: 'address',
                            value: ''
                        }
                    ]
                }
            }
        },
        watch:{
            input(v){
                this.tableCfg3.filter[0].value = v
            }
        }
    }
</script>
<style>
    .nameIpt{
        width:200px;
        margin-bottom: 20px;
    }
</style>
```
:::


### Table Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| model | 加载数据的方式 | string | local/remote | local |
| url | 加载远程数据的url | string | — | — |
| data | 显示的数据 | array | — | — |
| columns | 表格每列数据的显示配置 | array | — | — |
| showPagingTool | 是否显示分页组件 | boolean | — | false |
| showSelModel | 是否显示表格选择框 | boolean | — | false |
| filters | 表格搜索配置 | array | — | — |

### Table Events
| 事件名 | 说明 | 参数 |
| ---- | ---- | ---- |
| exportCsv | 将数据导出为`.csv`文件 | filename, original |


### filters 外部组件筛选配置
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| name | 筛选字段 | string | — | — |
| type | 筛选类型 | string | radio / checkbox / time | radio |
| value | 筛选的关键词 | string / array / time | — | — |

![el-grid](https://nodei.co/npm-dl/el-grid.png)