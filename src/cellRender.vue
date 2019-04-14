<script>
export default {
    functional: true,
    props: {
        row: Object,
        render: Function,
        column: {
            type: Object,
            default: null
        },
        index: Number
    },
    render: (h, ctx) => {
        let row =  ctx.props.row
        let index =  ctx.props.index
        let column = ''
        if (ctx.props.column){
            column = ctx.props.column
        }
        let render = ctx.props.render(h, row, index, column)
        if (typeof(render) != 'object'){
            return (<div>{render}</div>)
        }else{
            return (render)
        }
    }
}
</script>