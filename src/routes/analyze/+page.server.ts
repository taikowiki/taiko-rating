import { error } from '@sveltejs/kit';

export const actions = {
    async default({request}){
        const formData = await request.formData()

        const dataJSON = formData.get('data');

        if(!dataJSON){
            throw error(400);
        }

        let data:any;
        try{
            data = JSON.parse(dataJSON.toString());
        }
        catch{
            throw error(400);
        }

        return {
            data
        }
    }
}