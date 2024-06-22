<script lang="ts">
	export let userData: {
		nickname: string;
		taikoNumber: number;
		myDon: string;
	};
</script>

<div class="container">
    <img src={userData.myDon} alt=""/>
    <table>
        <tr>
            <td>
                닉네임
            </td>
            <td>
                {userData.nickname}
            </td>
        </tr>
        <tr>
            <td>
                북 번호
            </td>
            <td>
                {userData.taikoNumber}
            </td>
        </tr>
    </table>
</div>

<style>
    .container{
        width: min(100%, 300px);

        display:flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    img{
        width: min(100%, 200px);
        height: auto;
    }

    table{
        width: 100%;
        border-collapse: collapse;
    }

    td{
        text-align: center;
        border: 1px solid black;
    }
</style>