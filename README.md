# Image Entry to App
- [ ] Upload
  - [ ] Analyze
  - [ ] Storage of Analyzed Data
  - [ ] Storage of score
- [ ] Load only from inner DB
- [x] Nothing is pre-rendered on fresh start
  - [ ] Empty Database



# Demo 12 2024
- [x] gway handshake
- [x] vite
  - [ ] manifest
  - [ ] theme and color
  - [ ] standalone
  - [ ] versioning



# Demo 11 2024

- [x] Project Overview
  - [x] Show details
- [x] Settings
- [ ] Login
- [x] Upload
- [x] Analyze
- [x] Result
- [x] Change Results
- [x] Download Report

  /**
   * Detect iOS devices
   * @returns {boolean} Whether the current device is iOS
   */
  static isIOSDevice = () => {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform) || 
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  };

# Visuals

- https://ionicframework.com/docs/api/action-sheet
- SWR
- Zustand
- https://ionicframework.com/docs/api/ripple-effect

# Endpoints in order
- [] ImageData.initBlobs()
  - [x] buildDBandBlobs
    - [x] fullmessageRequest - worker
      - [x] rename - getProjectsAndImages
      - [x] return { sortedRes, projects }
      - [x] this.projectOrder = projects
      - [x] this.project = projects[projects.length - 1]
- [ ] getImageBatchAPI - BATCH!!!!
- [ ] 
- [x] Images sorted as appearing on screen
  - [x] createThisBlobs - need to resort by project as db order my be broken
- [ ] Image Upload
  - [ ] POST fromdata - image-upload
    - [ ] Distribution
    - [ ] Function test
      - [ ] Upload
      - [x] const compress = async (imageBuffer)
        - [x] compress
        - [x] rotate
        - [x] format
    - [-] Put to worker, not possible because of multer, good for now


# Render Images on screen
- [x] Images.tsx
  
  - [x] ImageBox.tsx
    - [x] By class - const { blobs, project } = classMap.get('ImageData')
      - [ ] Scroll down
        - [ ] onImagesLoadedChange
          - [ ] setOpenInfo(true)
          - [ ] setImagesLoaded(loaded)
        - [ ] On Images added
          - [ ] addedImages

# Upload Images
- [x] Button
  - [ ] Is there a direct button for camera?
- [x] Select
  - [ ] maybe limit to 5 at the same time?
- [ ] Compress
- [ ] Upload
  - [x] await classMap.get('ImageData').sendImages(fileArray)
    - [x] const { sha } = await api.sendImageGateway(preparedFile)
      - [ ] store in DB
        - [ ] Rework Storage to output ID - const { data } = await _storage.getData({ value: sha });
        - [ ] render
- [ ] Upload Images in different Project than last???



# Render Current project

# Sort Images
- [ ]

# Delete Images
- [ ]

# 