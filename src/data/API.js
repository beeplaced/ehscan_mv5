const gatewayUrl = window.location.hostname === 'localhost' ? process.env.GATEWAY_LOCAL : process.env.GATEWAY
console.log(gatewayUrl)
const chromaUrl = 'https://ehscan.com'
const currentDate = new Date().toISOString().split('T')[0];
import axios from 'axios';
import { IndexedDB } from './IDB.js'; const _storage = new IndexedDB();
const tenant = localStorage.getItem('tenant');
import { getHazardRangeColor } from '../data/levels.js';

export class API {

    getProjectOverview = async () => {//get all for now
        const headers = {
            tenant
        }
        try {
            const options = {
                url: `${gatewayUrl}/get-project-overview`,
                method: 'GET',
                headers
            };
            const response = await axios(options);
            const result = response.data.result
            return result;
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    getProject = async (project) => {
        const headers = {
            project,
            tenant
        } 
        try {
            const options = {
                url: `${gatewayUrl}/get-projects`,
                method: 'GET',
                headers
            };
            const response = await axios(options);
            const result = response.data.result
            return result;
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    getProjectImageAmount = async (project) => {
        const headers = { project, tenant };
        try {
            const options = {
                url: `${gatewayUrl}/get-project-image-amount`,
                method: 'GET',
                headers,
            };
            const { data } = await axios(options);
            const { result } = data
            return result
        } catch (error) {
            console.error('Error fetching full message data:', error.message || error);
            return {}; // Return an empty array if there's an error
        }
        };
    
    getProjectImageInfo = async (project) => {
    const headers = { project, tenant };
    try {
        const options = {
            url: `${gatewayUrl}/get-project-image-info`,
            method: 'GET',
            headers,
        };

        const { data } = await axios(options);
        const { result } = data
        return result
    } catch (error) {
        console.error('Error fetching full message data:', error.message || error);
        return {}; // Return an empty array if there's an error
    }
    };

    getReport = async ({ project, report }) => {
        console.log(project, report)
        const contentType = 'vnd.openxmlformats-officedocument.wordprocessingml.document'
        try {
            const options = {
                url: `${gatewayUrl}/custom-report`,
                method: 'POST',
                headers: {
                    'Content-type': `application/${contentType}`,
                    project,
                    report,
                    tenant,
                    clientId: localStorage.getItem('clientId')
                },
                responseType: 'blob'  // Important to set the response type to 'blob' to handle binary data
            };
            const response = await axios(options);
            const blob = new Blob([response.data], { type: `application/${contentType}` });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `${report}_${project}.docx`;  // Set a default filename for the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);  // Free up the object URL
            return true
        } catch (error) {
            //alert(`report Error ${error}`)
            console.error('Error downloading the report:', error);
            throw error;
        }
    };

    //0
    getProjectsAndImages = async (entry) => {
        const headers = { ...entry, tenant };
        try {
            const options = {
                url: `${gatewayUrl}/get-projects-images`,
                method: 'GET',
                headers,
            };

            const { data } = await axios(options);
            const { sortedRes, projects } = data?.result || {};
            return { sortedRes, projects };
        } catch (error) {
            console.error('Error fetching full message data:', error.message || error);
            return {}; // Return an empty array if there's an error
        }
    };

    sendImageGateway = async (entry) => {
        const { compressedFile } = entry
        try {
            const formData = new FormData();
            formData.append('file', compressedFile);
            const headers = {
                'Content-Type': 'multipart/form-data',
                tenant,
                "userId": localStorage.getItem('userId'),
                'project': localStorage.getItem('project')
            }
            const { data } = await axios.post(`${gatewayUrl}/image-upload`, formData, { headers });
            const { sha, saveImage } = data?.result || {};
            return { sha };
        } catch (error) {
            //alert(`sendImageGateway ${error}`)
            console.log(error);
            return { status: 500 }
        }
    };

    getImageBatchAPIx = async (allAPI) => {//Load Images from DB and Store blob and meta in indexedb
        const imagePromises = allAPI.map(async ({ sha, project, score }) => {
            const headers = { sha, tenant } 
            const response = await fetch(`${gatewayUrl}/images-renderer`, { headers });
            const blob = await response.blob();
            const store = await this.storeImageDB({ sha, blob, project, score })
            return { blob, project, store };
            });
        return await Promise.all(imagePromises);// return urls
    };

    getImageBatchAPI = async (allAPI) => {

        const imagePromises = allAPI.map(async ({ sha, project, score }) => {
          const headers = { sha, tenant };
          if ('caches' in window) {
            const cache = await caches.open('api-image-cache-v1'); // Open the cache used by the service worker
            const imageUrl = `${gatewayUrl}/images-renderer?sha=${sha}`; 
                const cachedResponse = await cache.match(imageUrl);
                if (cachedResponse) {
                  // If the image is found in cache, create an Object URL from the blob
                  const blob = await cachedResponse.blob();
                  const { data, status } = await _storage.getData({ value: sha });
                  const {project, score, id, clr} = data[0]
                  return { blob, project, score, id, clr }
                }
            }
          // Fetch the image as a blob from your API endpoint
          const response = await fetch(`${gatewayUrl}/images-renderer`, { headers });
          const blob = await response.blob();
          const store = await this.storeImageDB({ sha, project, score });
          await this.storeImageInCache(sha, blob);
          return { blob, project, store };
        });
      
        return await Promise.all(imagePromises); // Return results (blobs and store metadata)
      };

      storeImageInCache = async (sha, blob) => {
        const cache = await caches.open('api-image-cache-v1'); // Name of your cache
      
        // Create a URL for the image blob (or use sha as the cache key)
        const imageURL = `${gatewayUrl}/images-renderer?sha=${sha}`;
      
        // Ensure the image is cached with its sha as the key
        await cache.put(imageURL, new Response(blob, { status: 200, statusText: 'OK' }));
      };

    storeImageDB = async (entry) => {
        const { sha, project, score } = entry
        const storeData = {
            sha,
            date: currentDate,
            project: project
        };
        storeData.score = score || 0
        storeData.clr = score ? getHazardRangeColor(score).bck_color : ''
        const store = await _storage.storeData(storeData);
        if (store.status === 201) return await _storage.updateData(storeData);
        return store
    };

    projectResults = async (project) => {
        const headers = {
            project,
            tenant
        }

        try {
            const options = {
                url: `${gatewayUrl}/project-results`,
                method: 'GET',
                headers
            };
            const response = await axios(options);
            return response.data.result;
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    removeItem = async (entry) => {
        try {
            const userId = localStorage.getItem('userId')
            const response = await axios({
                url: `${gatewayUrl}/remove-item`,
                method: 'GET',
                headers: {
                    ...entry,
                    userId,
                    tenant
                }
            });
            const { data } = response
            return data?.result || {};
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    getImageAPI = async ({ sha }) => {

        const headers = {
            sha,
            tenant
        } 

        return new Promise(async (resolve, reject) => {
            fetch(`${gatewayUrl}/images-renderer`, { method: 'GET', headers })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(async (blob) => {
                    resolve(blob)
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    reject(error);
                });
        });
    };

    imageResult = async (sha) => {

        const headers = {
            sha,
            tenant
        } 

        try {
            const options = {
                url: `${gatewayUrl}/sha-results`,
                method: 'GET',
                headers
            };
            const response = await axios(options);
            return response.data.result[0];
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    setProject = async (formData) => {
        console.log(JSON.stringify(formData), tenant)
        try {
            const options = {
                url: `${gatewayUrl}/set-project`,
                method: 'POST',
                headers: { 
                    project: JSON.stringify(formData),
                    tenant
                }
            };
            const response = await axios(options);
            const result = response.data.result
            return result;
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    modifyAssessmentEntry = async (entry) => {
        try {
            const options = {
                url: `${gatewayUrl}/modify-assessment-entry`,
                method: 'GET',
                headers: {
                    ...entry,
                    tenant
                }
            };
            const response = await axios(options);
            const result = response.data.result
            return result
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    getSafeGuards = async (entry) => {

        try {
            const headers = {
                ...entry,
                tenant
            }
 
             const options = {
                 url: `${gatewayUrl}/get-safeguards`,
                 method: 'GET',
                 headers
             };
             const response = await axios(options);
             const result = response.data.result
             console.log(result)
             return result.safeguards
         } catch (error) {
             console.error('Error sending image:', error);
             throw error;
         }
     };

    elementSearch = async (entry) => {

       try {
           const headers = {
               ...entry,
               tenant
           }

            const options = {
                url: `${gatewayUrl}/element-search-request`,
                method: 'GET',
                headers
            };
            const response = await axios(options);
            const result = response.data.result
            return result
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

    setTask = async (entry) => {
        try {
            const userId = localStorage.getItem('userId')
            const response = await axios({
                url: `${gatewayUrl}/set-task`,
                method: 'GET',
                headers: {
                    ...entry,
                    userId,
                    tenant
                }
            });
            return response.data.result
        } catch (error) {
            console.error('Error sending image:', error);
            throw error;
        }
    };

}