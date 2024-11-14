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