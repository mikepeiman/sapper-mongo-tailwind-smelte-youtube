<script>
    import Button from "./smelte/Button";
    import { createEventDispatcher } from "svelte";
    let current_page = 1;
    let from = 1;
    let to = 1;
    let per_page = 1;
    let last_page = 1;
    let total = 0;
    let rows = [];

    let loading = true;

    const dispatch = createEventDispatcher();

    function page(dir) {
        if (dir == "back") {
            console.log(
                `🚀 ~ file: Pagination.svelte ~ line 15 ~ page ~ dir`,
                dir
            );
            dispatch("pagination", { dir: dir });
        }
        if (dir == "forward") {
            console.log(
                `🚀 ~ file: Pagination.svelte ~ line 19 ~ page ~ dir`,
                dir
            );
            dispatch("pagination", { dir: dir });
        }
        return "ERR: neither forward nor back specified";
    }
</script>

<Button class="pagination back" on:click={() => page("back")}>BACK</Button>
<Button class="pagination forward" on:click={() => page("forward")}
    >FORWARD</Button
>
