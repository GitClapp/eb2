import { json } from '@sveltejs/kit';
import * as XLSX from 'xlsx';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
    try {
        // Extract the JSON body sent from the frontend
        const data = await request.json();

        // Convert the incoming data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook to a buffer (to send as binary data)
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Set the appropriate headers for file download
        const headers = {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="data.xlsx"',
            'Content-Length': excelBuffer.byteLength.toString()
        };

        // Return the binary data in the response
        return new Response(excelBuffer, { headers });
    } catch (error) {
        return json({ error: 'Error generating Excel file' }, { status: 500 });
    }
};