// pages/api/fine-tuning.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

export async function handleFineTuning(req: NextApiRequest, res: NextApiResponse) {
    const filePath = path.join(process.cwd(), 'fine-tuning.json');

    try {
        if (req.method === 'POST') {
            // Update the JSON file with new feedback
            const { searchQuery, searchResult, storyNumber, score } = req.body;

            // Read existing data
            const data = await fs.readFile(filePath, 'utf8');
            let fineTuningFeedback = JSON.parse(data);

            // Add new feedback entry
            fineTuningFeedback.entries.push({
                sentence1: searchQuery,
                sentence2: searchResult,
                score
            });

            // Write updated data to the file
            const updatedJson = JSON.stringify(fineTuningFeedback, null, 2);
            await fs.writeFile(filePath, updatedJson);

            res.status(200).json({ message: 'Feedback updated successfully.' });
        } else {
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (err) {
        console.error('Error processing fine-tuning feedback:', err);
        res.status(500).json({ error: 'An error occurred while updating feedback.' });
    }
}
