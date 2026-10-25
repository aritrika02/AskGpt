import "dotenv/config";

const BASE_URL = process.env.LLM_BASE_URL || "https://api.openai.com/v1";
const MODEL = process.env.LLM_MODEL || "gpt-4o-mini";
const API_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;

const getOpenAIAPIResponse = async (messages) => {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL,
            messages
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "LLM request failed");
    }

    return data.choices[0].message.content;
};

export default getOpenAIAPIResponse;




// import "dotenv/config";

// const getOpenAIAPIResponse = async (messages) => {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages
//         })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//         throw new Error(data.error?.message || "OpenAI request failed");
//     }

//     return data.choices[0].message.content;
// };

// export default getOpenAIAPIResponse;



// // import "dotenv/config";

// // const getOpenAIAPIResponse = async(message) => {
// //     const options = {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/json",
// //             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
// //         },
// //         body: JSON.stringify({
// //             model: "gpt-4o-mini",
// //             messages: [{
// //                 role: "user",
// //                 content: message
// //             }]
// //         })
// //     };

// //     try {
// //         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
// //         const data = await response.json();
// //         return data.choices[0].message.content; //reply
// //     } catch(err) {
// //         console.log(err);
// //     }
// // }

// // export default getOpenAIAPIResponse;