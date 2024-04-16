<template>
    <h1>Movie!</h1>
</template>

<script>
export default {
    created() {
        console.log(this.$route)
        this.$store.dispatch('movie/searchMovieWithId', {
            // movie/tt4520988
            id: this.$route.params.id
        })
    }
}
</script>