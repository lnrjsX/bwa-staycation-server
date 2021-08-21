const Item = require('../models/Item');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Category = require('../models/Category');
const Bank = require('../models/Bank');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const travelers = await Member.find();
      const treasures = await Booking.find();
      const cities = await Item.find();
      const hero = {
        travelers: travelers.length,
        treasures: treasures.length,
        cities: cities.length,
      };
      const mostPicked = await Item.find().select('_id title country city price unit imageId').limit(5).populate({ path: 'imageId', select: '_id imageUrl' });

      const categorys = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city isPopular unit imageId',
          perDocumentLimit: 4,
          option: {
            sort: {
              sumBooking: -1,
            },
          },
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1,
          },
        });

      categorys.forEach((category) => {
        category.itemId.forEach(async (itemId, i) => {
          const item = await Item.findOne({ _id: itemId._id });
          item.isPopular = false;
          await item.save();
          if (category.itemId[0] == itemId) {
            item.isPopular = true;
            await item.save();
          }
        });
      });

      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial2.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content: 'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };
      res.status(200).json({ hero, mostPicked, category: categorys, testimonial });
    } catch (error) {
      res.status(500).json({ message: 'Server Lagi Rusak!' });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({
          path: 'featureId',
          select: '_id name qty imageUrl',
        })
        .populate({
          path: 'activityId',
          select: '_id name type imageUrl',
        })
        .populate({
          path: 'imageId',
          select: '_id imageUrl',
        });
      const bank = await Bank.find();
      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial1.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content: 'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server Lagi Rusak Nih bos' });
    }
  },

  bookingPage: async (req, res) => {
    try {
      const { idItem, duration, bookingDateStart, bookingDateEnd, firstName, lastName, email, phoneNumber, accountHolder, bankFrom } = req.body;

      if (!req.file) {
        res.status(404).json({ message: 'Images Not Found' });
      }

      if (
        duration == undefined ||
        bookingDateStart == undefined ||
        bookingDateEnd == undefined ||
        firstName == undefined ||
        lastName == undefined ||
        email == undefined ||
        phoneNumber == undefined ||
        accountHolder == undefined ||
        bankFrom == undefined
      ) {
        res.status(404).json({ message: 'Lengkapi Semua Field' });
      }

      const item = await Item.findOne({ _id: idItem });

      if (!item) {
        return res.status(404).json({ message: 'Item Not Found' });
      }

      item.sumBooking += 1;
      await item.save();

      let total = item.price * duration;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 + Math.random() * 9000000);

      const member = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      const newBooking = {
        invoice,
        bookingStartDate: bookingDateStart,
        bookingEndDate: bookingDateEnd,
        total: (total += tax),
        itemId: {
          _id: item._id,
          title: item.title,
          price: item.price,
          duration: duration,
        },
        memberId: member._id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom,
          accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);

      res.status(201).json({ message: 'Success Booking', booking });
    } catch (error) {
      res.status(500).json({ message: 'Server Lagi Rusak Nih bosq' });
    }
  },
};
