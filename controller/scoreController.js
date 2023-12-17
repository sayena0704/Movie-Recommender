const cosineModel = require('./../model/cosineModel');
const movie_data = require('./../model/movieModel');
const { TfIdf } = require('natural');
const Vector = require('vector-object');
require('dotenv').config();
const tfidf = require('natural');
const mongoose = require('mongoose');

//function which all fetch data from database
const getdata = async () => {
  const boom = await movie_data.movieModel.find();
  let arr = [];
  // creating an array of objects containing objects of id and genres
  boom.forEach((element) => {
    let tempobj = {};
    var services = element.genres;
    services.replaceAll(',', '');
    tempobj = { id: element.idd, content: services };
    arr.push(tempobj);
  });
  return arr;
};

// function to call createVectorsFromDocs
const createVectorsFromDocs = (processedDocs) => {
  const tfidf = new TfIdf();

  processedDocs.forEach((processedDocument) => {
    tfidf.addDocument(processedDocument.content);
  });

  const documentVectors = [];

  for (let i = 0; i < processedDocs.length; i += 1) {
    const processedDocument = processedDocs[i];
    const obj = {};

    const items = tfidf.listTerms(i);

    for (let j = 0; j < items.length; j += 1) {
      const item = items[j];
      obj[item.term] = item.tfidf;
    }

    const documentVector = {
      id: processedDocument.id,
      vector: new Vector(obj),
    };

    documentVectors.push(documentVector);
  }
  return documentVectors;
};

// function to call calcSimilarities
const calcSimilarities = (docVectors) => {
  // Here we take what could be max max_similar & min_score range
  const MAX_SIMILAR = 20;
  const MIN_SCORE = 0.65;
  const data = {};

  for (let i = 0; i < docVectors.length; i += 1) {
    const documentVector = docVectors[i];
    const { id } = documentVector;
    data[id] = [];
  }

  // loop for generating movies score and storing it in data object
  for (let i = 0; i < docVectors.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (j % 1000 === 0) {
        console.log(i);
      }
      const idi = docVectors[i].id;
      const vi = docVectors[i].vector;
      const idj = docVectors[j].id;
      const vj = docVectors[j].vector;
      const similarity = vi.getCosineSimilarity(vj);
      if (similarity > MIN_SCORE) {
        data[idi].push({ id: idj, score: similarity });
        data[idj].push({ id: idi, score: similarity });
      }
    }
  }

  Object.keys(data).forEach(async (id) => {
    data[id].sort((a, b) => b.score - a.score);
    if (data[id].length > MAX_SIMILAR) {
      data[id] = data[id].slice(0, MAX_SIMILAR);
      const test = new cosineModel({
        id: id,
        score: data[id],
      });
      await test.save();
    }
  });
  return data;
};

// function to get getSimilardocuments
const getSimilarDocuments = (id, trainedData) => {
  let similarDocuments = trainedData[id];

  if (similarDocuments === undefined) {
    return [];
  }

  return similarDocuments;
};

//user defined function to trained data
exports.traineddata = async () => {
  try {
    const objectarr = await getdata();
    const store = createVectorsFromDocs(objectarr);
    const op = calcSimilarities(store);
  } catch (err) {}
};
