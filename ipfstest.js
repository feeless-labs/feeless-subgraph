const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Function to add a file to IPFS
async function addFileToIPFS(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:5001/api/v0/add', form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('File added to IPFS with CID:', response.data.Hash);
    return response.data.Hash;
  } catch (error) {
    console.error('Error adding file to IPFS:', error.message);
    throw error;
  }
}

// Function to list files stored on the local IPFS node
async function listFilesOnIPFS() {
  try {
    const response = await axios.post('http://localhost:5001/api/v0/refs/local');
    const files = response.data.split('\n').filter(Boolean).map(line => {
      const parts = line.split(' ');
      return {
        Ref: parts[0],
        Err: parts[1] || null
      };
    });

    console.log('Files on local IPFS node:');
    files.forEach(file => {
      console.log(`- CID: ${file.Ref}`);
    });
  } catch (error) {
    console.error('Error listing files on IPFS:', error.message);
  }
}

// Main function to add a file and list all files
async function main() {
  const filePath = path.join(__dirname, 'README.md'); // Replace with your file path

  try {
    await addFileToIPFS(filePath);
    await listFilesOnIPFS();
  } catch (error) {
    console.error('Error in main function:', error.message);
  }
}

main();
