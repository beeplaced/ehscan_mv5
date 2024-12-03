//const gatewayUrl = window.location.hostname === 'localhost' ? process.env.GATEWAY_LOCAL : process.env.GATEWAY
import { IndexedDB } from './IDB.js'; const _storage = new IndexedDB();
// import Compressor from 'compressorjs';
import { API } from './API.js'; const api = new API();
const currentDate = new Date().toISOString().split('T')[0]; // Gets the current date in 'YYYY-MM-DD' format
// import ZT from '../webComponents/zTime.js'
// const zTime = new ZT()
const gatewayUrl = window.location.hostname === 'localhost' ? process.env.GATEWAY_LOCAL : process.env.GATEWAY
export class ImageRenderer {

    constructor() {
        this.blobs = {}
        this.projectOrder = []
        this.imagesPaginationLeft = []
        this.projectInner = '' //Image Container
        this.container = ''
        this.projectOrder = []
        this.project = ''
        this.searchProject = localStorage.getItem('searchProject') || ''
    }

    loadImageSequence = async (project) => {
        return new Promise(async (resolve) => {
        try{
            let startTime = performance.now();
            //CHECK LAST TIMESTAMP
            //Will be higher if new image is added or deleted
            // let allImages 
            // const output = await _storage.getData({ value: project, field: 'project' });
            // console.log(output)
            // allImages = output.data
            const allAPI = await api.getProjectImageInfo(project) //load project from DB
            console.log('create Blobs:', this.executionTime(startTime));
            const APIDATA = await api.getImageBatchAPI(allAPI)
            console.log(APIDATA)
            resolve(APIDATA)
        } catch (error) {
            console.log(error)
        }
        })
    }

    imagesBySearchResult = async (searchterm) => {
        return new Promise(async (resolve) => {
            try{
                let startTime = performance.now();
                const allAPI = await api.searchResult(searchterm)
                console.log('create Blobs:', this.executionTime(startTime));
                const APIDATA = await api.getImageBatchAPI(allAPI)
                console.log(APIDATA)
                resolve(APIDATA)
            } catch (error) {
                console.log(error)
            }
            })
    }

    imgByID = async (id) => {
        return new Promise(async (resolve) => {
            try {
        const value = parseInt(id)
        const field = "id"
        const { data, status } = await _storage.getData({ value, field })
        const { sha } = data
        console.log(data, id, status)
        if (status === 201 && data === undefined) {//find first
            return { status: 204 } //not found
            // const first = await _storage.getFirstEntry()
            // return this.returnImgFromDB(first)
        }
        if (status !== 200) return


        const APIDATA = await api.getImageBatchAPI([data])
        console.log(APIDATA)
        resolve({...APIDATA[0], sha})
        } catch (error) {
            console.log(error)
        }
        })
    };

    createValidImageObjects = (data, project) => {
        return new Promise(async (resolve) => {
            try {
                this.blobs[project] = []
                const res = []
                const imageSort = data.sort((a, b) => a.score - b.score)
                //.sort((a, b) => a.id - b.id)
                for (const { sha, blob, id, project, score, clr } of imageSort) {
                    const imgBlob = await this.createObjectURLAsync(blob)
                    if (!this.blobs[project]) this.blobs[project] = []
                    res.push({
                        imgBlob,
                        id,
                        project,
                        ...(score !== undefined && { score }),
                        ...(clr !== undefined && { clr }),
                        revokeUrl: () => URL.revokeObjectURL(blob)
                    })
                }
                resolve(res)
            } catch (error) {
                // Alert the error
                alert('An error occurred while rendering images: ' + error.message);
                resolve(); // Optionally resolve with no images
            }
        });
    };

    loadProjectImages = async (project) => {
        return new Promise(async (resolve) => {
            try {
                let startTime = performance.now();
                const amount = await api.getProjectImageAmount(project); //checkServerImagesAmount
                const output = await _storage.getData({ value: project, field: 'project' });
                const { status, data } = output
                if (status !== 200) throw new Error("Something went wrong with inner DB");
                if (data.length === 0 || data.length !== amount) { //Empty DB
                    this.ReloadImagesFromServer(project)
                    resolve(true)
                }
                if (!this.blobs[project] || this.blobs[project].length !== amount) await this.createValidImageObjects(data, project);
                console.log('create Blobs:', this.executionTime(startTime));
                resolve(true)
            } catch (error) {
                console.log(error)
            }
        })
    }

    JustImagesFromDB = async (project) => {
        const allAPI = await api.getProjectImageInfo(project) //load project from DB
        await this.addMissingDatainDB(allAPI); 
        const { data } = await _storage.getData({ value: project, field: 'project' });
        return await this.createValidImageObjects(data, project)
    }

    ReloadImagesFromServer = async (project) => {
        let startTime = performance.now();
        this.project = project
        const allAPI = await api.getProjectImageInfo(project) //load project from DB
        console.log('get Images from DB', allAPI)
        const { data } = await _storage.getData({ value: project, field: 'project' });
        console.log(data)
        let allDB = data //await _storage.getAllData(); //console.log('get Images from DB', allDB)
        await this.checkImagesinDBwithAPI({ allDB, allAPI })//check all Data from DB
        const allDBShas = allDB.map(db => db.sha);
        const imagesMissingInDB = allAPI.filter(a => !allDBShas.includes(a.sha))
        if (imagesMissingInDB.length > 0) await this.addMissingDatainDB(imagesMissingInDB); 
        const output = await _storage.getData({ value: project, field: 'project' });
        // console.log('loadProjectImages', this.executionTime(startTime));     
        // console.log(output)
        startTime = performance.now();
        const res = await this.createValidImageObjects(output.data, project)
        console.log('create Blobs:', this.executionTime(startTime));
        return res
    }

    createObjectURLAsync = (blob) => {
        return new Promise((resolve, reject) => {
            try {
                if (!blob || !(blob instanceof Blob)) {
                    alert('error')
                    throw new Error("Invalid blob provided");
                }
                const url = URL.createObjectURL(blob);
                resolve(url);
            } catch (error) {
                reject(error);
            }
        });
    };

    // createValidImageObjectsX = async (data) => {

    //     const delItems = []

    //     const promises = data
    //         .sort((a, b) => a.score - b.score)
    //         //.sort((a, b) => a.id - b.id)
    //         .map(({ blob, id, project, score, clr }) => {
    //             const url = URL.createObjectURL(blob);
    //             return new Promise((resolve) => {
    //                 const img = new Image();
    //                 img.onload = () => {
    //                     resolve({
    //                         imgBlob: url,
    //                         id,
    //                         project,
    //                         ...(score !== undefined && { score }),
    //                         ...(clr !== undefined && { clr }),
    //                     });
    //                 };
    //                 img.onerror = () => {
    //                     delItems.push(id)
    //                     //alert(`Blob with ID ${id} is invalid.`);
    //                     resolve(null); // or handle broken blobs differently
    //                 };
    //                 img.src = url;
    //             });
    //         });

    //     // Wait for all promises and filter out invalid blobs
    //     const results = await Promise.all(promises);
    //     if (delItems.length > 0) {
    //         //await this.removeImages(delItems)
    //         //Cant remove broken images, there are several reasons for an error, 
    //         //Has to be done manually
    //     }
    //     return results.filter(Boolean);
    // };

    sortByProject = async (project) => {
        return new Promise(async (resolve) => {
            try {
                this.searchProject = project
                localStorage.setItem('searchProject', project)
                await this.buildDBandBlobs()
                resolve()
            } catch (error) {
                console.log(error)
            }
        })
    }

    initBlobs = async () => {
        return new Promise(async (resolve) => {
        try {
            await this.buildDBandBlobs()
            resolve()
        } catch (error) {
            console.log(error)
        }
        })
    }

    checkImagesinDBwithAPI = async (entry) => {
        const { allDB, allAPI } = entry
        return new Promise(async (resolve) => {
            for (const dbData of allDB) {
                const { sha, project } = dbData
                const apiDataInDB = allAPI.find(api => api.sha === sha);
                if (!apiDataInDB && this.searchProject === '') { //remove from DB, if all data is considered
                    const removeDBData = await _storage.deleteDataBySha(sha); console.log("removeDBData", removeDBData)
                }
                if (apiDataInDB && apiDataInDB.project !== project) {//change project in DB
                    dbData.project = apiDataInDB.project;
                    dbData.date = currentDate
                    const update = await _storage.updateData(dbData); console.log("different project - update DB", update);
                }
            }
            resolve()
        })
    }

    addMissingDatainDB = async (imagesMissingInDB) => {
        console.log('imagesMissingInDB: ',imagesMissingInDB.length)
        return new Promise(async (resolve) => {
            if (imagesMissingInDB.length > 0) {
                const startTime = performance.now();
                const newData = await api.getImageBatchAPI(imagesMissingInDB)//.slice(0, 30))
                console.log('getImageBatchAPI', this.executionTime(startTime));
                console.log(imagesMissingInDB)
                resolve(newData)
            }
            resolve([])
        })
    }

    moveSortEntryToEnd = (projects) => {
        return projects.sort((a, b) => {
            if (a === this.searchProject) return 1; // Move "specialEntry" to the end
            if (b === this.searchProject) return -1;
            return 0; // Keep the other elements in their current order
        });
    }

    buildDBandBlobs = async () => {//First Attempt always holds last results
        return new Promise(async (resolve) => {
            let startTime = performance.now();
            const { sortedRes, projects } = await api.getProjectsAndImages({ database: 'image_results' }); 
            console.log('get Images from API', sortedRes, projects)
            const allAPI = sortedRes
            this.projectOrder = this.searchProject !== '' ? this.moveSortEntryToEnd(projects) : projects
            this.project = this.projectOrder[this.projectOrder.length - 1]
            localStorage.setItem('project', this.project) //Fallback, if db is not loaded
            let allDB = await _storage.getAllData(); //console.log('get Images from DB', allDB)
            await this.checkImagesinDBwithAPI({ allDB, allAPI })//check all Data from DB
            const allDBShas = allDB.map(db => db.sha);
            const imagesMissingInDB = allAPI.filter(a => !allDBShas.includes(a.sha))
            const newData = await this.addMissingDatainDB(imagesMissingInDB); console.log("newData", newData)
            if (newData.length > 0) allDB = await _storage.getAllData(); //get entire DB Again here
            console.log('buildDBandBlobs', this.executionTime(startTime));
            startTime = performance.now();
            this.blobs = allDB
                .sort((a, b) => this.projectOrder.indexOf(a.project) - this.projectOrder.indexOf(b.project))
                .map(({ blob, id, project }) => ({ imgBlob: URL.createObjectURL(blob), id, project }));
            console.log('createThisBlobs:', this.executionTime(startTime));
            resolve();
        });
    }

    createThisBlobs = async () => {
        return new Promise(async (resolve) => {
            const startTime = performance.now();
            const all = await _storage.getAllData();
            console.log(all)
            this.blobs = all
                .sort((a, b) => this.projectOrder.indexOf(a.project) - this.projectOrder.indexOf(b.project))
                .map(({ blob, id, project }) => ({
                    imgBlob: URL.createObjectURL(blob),
                    id,
                    project
                }));
            console.log('createThisBlobs:', this.executionTime(startTime));
            resolve(); // Resolve the promise with the blobs array
        });
    }

    imagesByProjectID = async (project) => {
        return new Promise(async (resolve) => {
            try {

                //init

                //get Shas from db

                //render as PLaceholder
                const grab = await _storage.getData({ value: project, field: 'project' });
                const { data } = grab
                const images = data.map(({ blob, id, project }) => {
                    return {
                        imgBlob: URL.createObjectURL(blob),
                        id,
                        project
                    }
                })
                resolve(images)
            } catch (error) {
                // Alert the error
                alert('An error occurred while rendering images: ' + error.message);
                resolve(); // Optionally resolve with no images
            }
        });
    }

    renderImagesSpecific = (project) => {
        return new Promise(async (resolve) => {
            try {
                const { data } = await _storage.getData({ value: project, field: 'project' });
                const images = data.map(({ blob, id }) => {
                    if (!blob || !(blob instanceof Blob)) {
                        alert(`Invalid blob for id ${id}`);
                        return null; // Skip invalid blobs
                    }
                    return {
                        imgBlob: URL.createObjectURL(blob),
                        id
                    };
                }).filter(Boolean); // Remove any null values

                resolve(images);
            } catch (error) {
                // Alert the error
                alert('An error occurred while rendering images: ' + error.message);
                resolve(); // Optionally resolve with no images
            }
        });
    };


    addToThisBlobs = async (imageEntry) => {
        return new Promise(async (resolve) => {
        const startTime = performance.now();
        const { blob, id, project } = imageEntry
        this.blobs = this.blobs.filter(image => image.id !== id);
        this.blobs.push({
            imgBlob: URL.createObjectURL(blob),
            id,
            project
            });
        console.log('addToThisBlobs:', this.executionTime(startTime));
        resolve();
        });
    }

    removeImages = async (selectedItems) => {
        return new Promise(async (resolve) => {
        console.log(selectedItems)
            for (const imageID of selectedItems) {
                const sha = await this.imgSHAByID(imageID)
                const removeItem = await api.removeItem({ sha }); console.log("removeItem", removeItem)
                const removeDBData = await _storage.deleteDataBySha(sha); console.log("removeDBData", removeDBData)
            }
            resolve()
        })
    }

    moveItems = async (updateItems, filteredItems, lastIndex) => {
        return new Promise(async (resolve) => {
            if (updateItems.length >= 0) {
                for (const updateItem of updateItems) {
                    const { id } = updateItem
                    const { status, data } = await _storage.getData({ value: id, field: 'id' })
                    //check status
                    let newData = {
                        ...data,
                        ...updateItem
                    }
                    newData.date = currentDate
                    const update = await _storage.updateData(newData); console.log("update DB", update);
                }
            }

            this.blobs = [
                ...filteredItems.slice(0, lastIndex + 1),
                ...updateItems,
                ...filteredItems.slice(lastIndex + 1)
            ];

            //save to db!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            resolve(this.blobs); // Resolve the promise with the blobs array
        });
    }

    renderImagesMain = () => { // Triggered in IMAGES useEffect(() => { // Load Images
        return new Promise(async (resolve) => {
            //const startTime = performance.now();
            const all = await _storage.getAllData();
            this.blobs = all
                .sort((a, b) => this.projectOrder.indexOf(a.project) - this.projectOrder.indexOf(b.project))
                .map(({ blob, id, project }) => ({
                    imgBlob: URL.createObjectURL(blob),
                    id,
                    project
                }));

            //await this.addnewProjectDongle(); // Await the promise returned by addnewProjectDongle
            //console.log('renderImagesMain', this.executionTime(startTime));
            resolve(this.blobs); // Resolve the promise with the blobs array
        });
    }

    getImages = async () => {
        let allDB = await _storage.getAllDataSort('project');
        console.log(allDB)
    }

    addImages = async (fileList) => {
        const blobs = [];
        await Promise.all(Array.from(fileList).map(async (file) => {
            try {
                const preparedFile = await this.prepareFile(file);
                console.log(`preparedFile`, preparedFile)
                const { compressedFile } = preparedFile
                const { type } = compressedFile
                const blob = new Blob([compressedFile], { type });
                console.log(`blob`, blob)
                const { sha } = await api.sendImageGateway(preparedFile);
                console.log("sha", sha)
                await this.storeImageDB({ sha, blob, project: this.project }); 
                const { data } = await _storage.getData({ value: sha });
                const { id, project } = data[0];
                //await this.addToThisBlobs({ blob, id, project })
                blobs.push({ imgBlob: URL.createObjectURL(blob), id, project });
            } catch (error) {
                console.error("Error in processing file:", file.name, error);
            }
        }));
        return blobs;
    }

    sendImages = async (fileList) => {
        const blobs = [];
        await Promise.all(Array.from(fileList).map(async (file) => {
            try {
                const preparedFile = await this.prepareFile(file);
                console.log(`preparedFile`, preparedFile)
                const { compressedFile } = preparedFile
                const { type } = compressedFile
                const blob = new Blob([compressedFile], { type });
                console.log(`blob`, blob)
                const { sha } = await api.sendImageGateway(preparedFile);
                console.log("sha", sha)
                await this.storeImageDB({ sha, blob, project: this.project }); // Store the image in the database
                const { data } = await _storage.getData({ value: sha });
                const { id, project } = data[0];
                await this.addToThisBlobs({ blob, id, project })
                blobs.push({ imgBlob: URL.createObjectURL(blob), id, project }); // Push the image Blob URL along with other metadata to the array
            } catch (error) {
                console.error("Error in processing file:", file.name, error);
            }
        }));
        return blobs;
    }

    storeImageDB = async (entry) => {
        const { sha, blob, project } = entry
        const storeData = {
            sha,
            blob,
            date: currentDate,
            project: project
        };
        console.log(storeData)
        const store = await _storage.storeData(storeData);
        console.log("store", store)
        if (store.status === 201) return await _storage.updateData(storeData);
        return store
    };

    prepareFile = async (file) => {
        return new Promise(async (resolve) => {
            //await this.metaData(file)
            const { compressedFile, metadata } = await this.compressFile(file)
            //if (this.context.retValidatedInput()) output.file.context = this.context.retValidatedInput()
            //console.log({ compressedFile, metadata })
            resolve({ compressedFile })
        })
    }

    compressFile = async (file) => {
        return new Promise((resolve, reject) => {
            if (file.size <= 8 * 1024 * 1024) { // 8 MB in bytes
                const fileInfo = {
                    lastModified: file.lastModified,
                    lastModifiedDate: new Date(file.lastModified),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                };
                const fileBlob = new Blob([file], { type: file.type });
                resolve({ compressedFile: fileBlob, metadata: fileInfo });
            } else {
                new Compressor(file, {
                    quality: 0.6,
                    maxWidth: 1280,
                    width: 1280,
                    success(compressedFile) {
                        const compressedFileInfo = {
                            lastModified: compressedFile.lastModified,
                            lastModifiedDate: new Date(compressedFile.lastModified),
                            name: compressedFile.name,
                            size: compressedFile.size,
                            type: compressedFile.type,
                        };
                        const compressedFileBlob = new Blob([compressedFile], { type: compressedFile.type });
                        resolve({ compressedFile: compressedFileBlob, metadata: compressedFileInfo });
                    },
                    error(err) {
                        reject(err);
                    },
                });
            }
        });
    };


    // getLastProject = () => {
    //     console.log(typeof (this.projectOrder), this.projectOrder, this.blobs.length)
    //     let lastProject

    //     switch (true) {
    //         case typeof (this.projectOrder) === 'string':
    //             lastProject = this.projectOrder
    //             break;
    //         case
    //             this.projectOrder.length === 0
    //             || localStorage.getItem('project') === "undefined":
    //             lastProject = 'Risk Assessment'
    //             localStorage.setItem('project_create', JSON.stringify({
    //                 title: lastProject,
    //                 context: 'Look for general Hazards',
    //                 comment: 'created automatically'
    //             }));
    //             break;
    //         default:

    //             lastProject = this.projectOrder[this.projectOrder.length - 1]
    //             break;
    //     }
    //     localStorage.setItem('project', lastProject)
    //     console.log(localStorage.getItem('project'), localStorage.getItem('project_create'))
    // }

    // checkImagesAvailable = async () => {//Initail Pull oF Images and Projects
    //     try {
    //         //const startTime = performance.now();
    //         this.projectOrder = await api.getProject('simple')
    //         console.log(this.projectOrder)
    //         let alls = await api.getProjectsAndImages({ database: 'image_results' });
    //         console.log(alls)

    //         // if (alls.length === 0) {//For now, if DB is empty, delete browser db, quick and dirty
    //         //     console.log(alls)
    //         //     await this.emptyImagesAvailable()
    //         // }
    //         //later only check amount and compare if != load all / chunks
    //         let allDB = await _storage.getAllDataSort('project');
    //         const allDBShas = allDB.map(db => db.sha);
    //         const filteredImages = alls
    //             .filter(a => !allDBShas.includes(a.sha))
    //         // .sort((a, b) => this.projectOrder.indexOf(a.project) - this.projectOrder.indexOf(b.project))

    //         console.log(filteredImages)

    //         for (const { sha, project } of filteredImages) {
    //             const blob = await api.getImageAPI({ sha, database: 'image_results' })
    //             await this.storeImageDB({ sha, blob, project });
    //         }
    //         //this.getLastProject()
    //         //console.log('checkImagesAvailable', this.executionTime(startTime))
    //         return //alls.length;
    //     } catch (error) {
    //         console.error('Error processing images:', error);
    //         return false;
    //     }
    // };



    findNextAndPrevIds = async (id) => {
        const value = parseInt(id)
        const res = await _storage.findNextAndPrevIds(value)
        return res
    };

    imgBySha = async (sha) => {
        const { data, status } = await _storage.getData({ value: sha });
        if (status === 201 && data === undefined) {//find first
            return { status: 204 } //not found
        }
        if (status !== 200) return
        return this.returnImgFromDB(data[0])
    };

    imgIDBySHA = async (sha) => {
        const { data, status } = await _storage.getData({ value: sha });
        return status === 200 ? data?.[0]?.id : undefined;
    };

    imgSHAByID = async (id) => {
        const value = parseInt(id)
        const field = "id"
        const { data, status } = await _storage.getData({ value, field })
        return status === 200 ? data?.sha : undefined;
    };

    returnImgFromDB = (data) => {
        const imgBlob = URL.createObjectURL(data.blob);
        const { sha, project, id } = data
        return { status: 200, imgBlob, sha, project, id }
    };

    getImageResults = async (sha) => {
        return await api.imageResult(sha)
    }

    executionTime = (startTime) => {
        const endTime = performance.now();
        const executionTimeRes = (endTime - startTime) / 1000; // Convert milliseconds to seconds
        const executionTime = `${executionTimeRes.toFixed(3)} seconds`;
        return executionTime
    }

}