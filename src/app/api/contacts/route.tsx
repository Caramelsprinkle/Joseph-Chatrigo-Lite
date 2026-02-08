export async function GET(request: Request) {
    const contacts = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com" },
        { id: 4, name: "Alice Williams", email: "alice@example.com" }
    ];

    return new Response(JSON.stringify(contacts), {
        headers: { "Content-Type": "application/json" }
    });
}