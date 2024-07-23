interface RequestProps {
    query: string;
    variables?: {};
    includeDrafts?: boolean;
}

export const performDatoCmsRequest = async ({ query, variables = {}, includeDrafts = false }: RequestProps) => {
    const response = await fetch("https://graphql.datocms.com/", {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
            ...(includeDrafts ? { "X-Include-Drafts": "true" } : {}),
        },
        method: "POST",
        body: JSON.stringify({ query, variables }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(responseBody)}`);
    }

    return responseBody;
}