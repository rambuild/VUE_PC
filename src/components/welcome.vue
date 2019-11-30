<<template>
    <div>
        <h1>welcome：{{username}}</h1>
    </div>
</template>

<script>
export default {
    data(){
        return{
            username:''
        }
    },
    methods:{

    },
    mounted(){
        this.username = window.sessionStorage.getItem('username')
    }
}
</script>

<style lang="scss" scoped>
    
</style>