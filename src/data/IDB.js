export class IndexedDB {

    constructor(db = 'images') {

        switch (db) {
            case 'settings':
                this.dbVersion = 1;
                this.dbName = 'settingStore'
                this.storeName = 'settings'
                this.keyPath = 'title'
                this.indexes = [] 
                break;
            default://images
                this.dbVersion = 1;
                this.dbName = localStorage.getItem('tenant')
                this.storeName = 'images'
                this.keyPath = 'sha'
                this.indexes = ['project', 'date'] 
                break;
        }

        this.dbPromise = this.openDatabase();
    }

    emptyDatabase = async() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName);

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(db.objectStoreNames, 'readwrite');
                let completedRequests = 0;
                const totalRequests = db.objectStoreNames.length;
                if (totalRequests === 0) {
                    resolve();
                    return;
                }

                // Clear each object store
                for (const storeName of db.objectStoreNames) {
                    const objectStore = transaction.objectStore(storeName);
                    const clearRequest = objectStore.clear();

                    clearRequest.onsuccess = () => {
                        completedRequests++;
                        if (completedRequests === totalRequests) {
                            resolve(this.dbName);
                        }
                    };

                    clearRequest.onerror = (event) => {
                        reject(event.target.error);
                    };
                }
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onupgradeneeded = (event) => {
                // If the database is upgraded or created, close it
                const db = event.target.result;
                db.close();
                reject(new Error('Database cannot be emptied because it is being upgraded.'));
            };
        });
    }

    openDatabase = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            // request.onupgradeneeded = (event) => {

            //     const db = event.target.result;

            //     if (!db.objectStoreNames.contains(this.storeName)) {
            //         db.createObjectStore(this.storeName, { keyPath: this.keyPath }); //autoIncrement: true
            //     }
            // };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                let objectStore;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                } else {
                    objectStore = request.transaction.objectStore(this.storeName);
                }

                if (!objectStore.indexNames.contains(this.keyPath)) {
                    objectStore.createIndex(this.keyPath, this.keyPath, { unique: true });
                }

                this.indexes.map(project => {
                    if (!objectStore.indexNames.contains(project)) {
                        objectStore.createIndex(project, project, { unique: false });
                    }
                })
            };

            // request.onupgradeneeded = (event) => {
            //     const db = event.target.result;
            //     let objectStore;
            //     if (!db.objectStoreNames.contains(this.storeName)) {
            //         objectStore = db.createObjectStore(this.storeName, { keyPath: this.keyPath });
            //     } else {
            //         objectStore = request.transaction.objectStore(this.storeName);
            //     }

            //     if (!objectStore.indexNames.contains('id')) {
            //         objectStore.createIndex('id', 'id', { unique: true, autoIncrement: true });
            //     }

            //     this.indexes.map(project => {
            //         if (!objectStore.indexNames.contains(project)) {
            //             objectStore.createIndex(project, project, { unique: false });
            //         }
            //     })
            // };

            request.onsuccess = (event) => {
                const db = event.target.result;
                var dbNames = event.target.result.objectStoreNames;
                // Convert objectStoreNames to an array (if necessary)
                var dbNamesArray = Array.from(dbNames);
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(`Database error: ${event.target.errorCode}`);
            };
        });
    }

    getObjectStoreSize = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onsuccess = (event) => {
                var db = event.target.result;
                var transaction = db.transaction([this.storeName], "readonly");
                var objectStore = transaction.objectStore(this.storeName);
                var size = 0;
                var cursorRequest = objectStore.openCursor();

                cursorRequest.onsuccess = (event) => {

                    const getSizeInBytes = (obj) => {
                        var str = JSON.stringify(obj);
                        var bytes = new TextEncoder().encode(str).length;
                        return bytes;
                    }

                    var cursor = event.target.result;
                    if (cursor) {
                        var value = cursor.value;
                        size += getSizeInBytes(value);
                        cursor.continue();
                    } else {
                        resolve(size);
                    }
                };

                cursorRequest.onerror = function () {
                    reject("Failed to iterate records in the object store");
                };
            };

            request.onerror = function () {
                reject("Failed to open database");
            };
        });
    }

    getObjectStoreLength = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onsuccess = (event) => {
                var db = event.target.result;
                var transaction = db.transaction([this.storeName], "readonly");
                var objectStore = transaction.objectStore(this.storeName);
                var countRequest = objectStore.count();

                countRequest.onsuccess = () => {
                    resolve(countRequest.result);
                };

                countRequest.onerror = () => {
                    reject("Failed to count records in the object store");
                };
            };

            request.onerror = () => {
                reject("Failed to open database");
            };
        });
    }

    storeData = async (data) => {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const check = data[this.keyPath]
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            if (store.get(check)) resolve({ status: 201, message: 'data exists' })
            const request = store.add(data);

            request.onsuccess = () => {
                resolve({ status: 200, message: 'Data added successfully' });
            };

            request.onerror = (event) => {
                if (event.target.error.name === 'ConstraintError') {
                    // Data already exists, retrieve the existing data
                    const getRequest = store.get(data[this.keyPath]);

                    getRequest.onsuccess = () => {
                        resolve({ message: 'Data already exists', data: getRequest.result });
                    };

                    getRequest.onerror = (event) => {
                        reject('Error retrieving existing data');
                    };
                } else {
                    reject(`Error adding data: ${event.target.error}`);
                }
            };
        });
    }

    getData = async ({value, field='sha'}) => {
        const startTime = performance.now();
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);

            let request;

            if (field === 'id') {
                console.log(value)
                request = store.get(value);
            } else {
                // Otherwise, use the specified index
                if (!store.indexNames.contains(field)) {
                    reject(new Error(`Index for field '${field}' does not exist`));
                    return;
                }
                const index = store.index(field);
                request = index.getAll(value);
            }

            request.onsuccess = (event) => {
                resolve({ status: event.target.result ? 200 : 201, data: event.target.result });
            };
            request.onerror = (event) => {
                console.log(event.target, event.target.error.name)
                resolve(false);
            };
        });
    }

    getAllDataSort = async (sortField = null, sortDirection = 'next') => {
        // next: The cursor shows all records, including duplicates, in ascending order.
        // nextunique: The cursor shows only unique records in ascending order.
        // prev: The cursor shows all records, including duplicates, in descending order.
        // prevunique: The cursor shows only unique records in descending order.

            const db = await this.dbPromise;

            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);

                // Determine whether to use an index or fetch all records
                const useIndex = sortField && store.indexNames.contains(sortField);
                const index = useIndex ? store.index(sortField) : null;

                // Open cursor or fetch all records based on index existence
                let request;
                if (useIndex) {
                    request = index.openCursor(null, sortDirection);
                } else {
                    request = store.getAll();
                }

                const results = [];

                request.onsuccess = (event) => {
                    if (useIndex) {
                        const cursor = event.target.result;
                        if (cursor) {
                            results.push(cursor.value);
                            cursor.continue();
                        } else {
                            resolve(results);
                        }
                    } else {
                        resolve(event.target.result);
                    }
                };

                request.onerror = (event) => {
                    console.error('Error fetching data:', event.target.error);
                    resolve({ status: 500, data: null });
                };
            });
    };

    getAllData = async () => {
        const db = await this.dbPromise;
        return new Promise((resolve) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Error fetching data:', event.target.error);
                resolve({ status: 500, data: null });
            };
        });
    };

    getFirstEntry = async () => {
        const db = await this.dbPromise;
        return new Promise((resolve) => {
            const transaction = db.transaction(this.storeName, 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.openCursor(); // Open a cursor to iterate over entries

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resolve(cursor.value); // First entry found
                } else {
                    resolve(null); // No entries found
                }
            };

            request.onerror = (event) => {
                console.error('Error fetching first entry:', event.target.error);
                resolve({ status: 500, data: null });
            };
        });
    };

    objectsAreEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    updateData = async (newData) => {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {

            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            // Check if the key exists
            const check = newData[this.keyPath]
            // console.log(check)
            // const getRequest = store.get(check);

            const shaIndex = store.index('sha'); // Assuming 'sha' index was created when setting up the store
            const getRequest = shaIndex.get(check);//CHECK IF SEARCHB BY ID OR FIELD; OK FOR NOW

            getRequest.onsuccess = (event) => {
                const existingData = event.target.result;
                if (this.objectsAreEqual(existingData, newData)) {
                    resolve({ status: 204, message: 'equal data already exists' })
                    return
                }

                if (existingData) {
                    
                    const mergedData = {
                        ...existingData, // Spread existingData
                        ...newData, // Spread newData (overwrites existing keys)
                    };
                    const updateRequest = store.put(mergedData);

                    updateRequest.onsuccess = () => {
                        resolve({ status: 200, message: 'Data updated successfully' })
                    };

                    updateRequest.onerror = (event) => {
                        reject(`Error updating data: ${event.target.error}`);
                    };
                } else {
                    reject(`Data with key ${newData.title} not found`);
                }
            };

            getRequest.onerror = (event) => {
                reject(`Error retrieving data: ${event.target.error}`);
            };
        });
    }

    deleteDataBySha = async (shaToDelete) => {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const shaIndex = store.index('sha');
            const getRequest = shaIndex.get(shaToDelete);

            getRequest.onsuccess = (event) => {
                const existingData = event.target.result;

                if (existingData) {
                    const deleteRequest = store.delete(existingData.id);
                    deleteRequest.onsuccess = async () => {
                        const checkRequest = shaIndex.get(shaToDelete);
                        checkRequest.onsuccess = (checkEvent) => {
                            if (!checkEvent.target.result) {
                                resolve({ status: 200, message: `Data with sha ${shaToDelete} deleted successfully` });
                            } else { // Data is still there
                                reject({ status: 500, message: `Failed to delete data with sha ${shaToDelete}` });
                            }
                        };
                        checkRequest.onerror = (errorEvent) => {
                            reject(`Error checking data after delete: ${errorEvent.target.error}`);
                        };
                    };
                } else {
                    resolve({ status: 404, message: `Data with sha ${shaToDelete} not found` });
                }
            };

            getRequest.onerror = (event) => {
                reject(`Error retrieving data for deletion: ${event.target.error}`);
            };
        });
    };


    getKeyDataFromIndexedDB = async (key) => {
    
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(this.storeName, 'readonly');
            const objectStore = transaction.objectStore(this.storeName);
            const keyDataArray = [];

            objectStore.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty(key)) {
                        keyDataArray.push({[key]: cursor.value[key]});
                    }
                    cursor.continue();
                } else {
                    resolve(keyDataArray);
                }
            };

            objectStore.openCursor().onerror = (event) => {
                console.error('Cursor error:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        };
    });
    }

    executionTime = (startTime) => {
        const endTime = performance.now();
        const executionTimeRes = (endTime - startTime) / 1000; // Convert milliseconds to seconds
        const executionTime = `${executionTimeRes.toFixed(3)} seconds`;
        return executionTime
    }

}