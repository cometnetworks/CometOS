import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
    const { data, error } = await supabase
        .from('checklist_templates')
        .select('*, items:checklist_items!inner(*)');

    if (error) {
        console.error("ERROR DETECTED:", JSON.stringify(error, null, 2));
    } else {
        console.log("DATA:", JSON.stringify(data, null, 2));
    }
}

test()
