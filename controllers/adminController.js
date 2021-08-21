const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Users = require('../models/Users');
const Booking = require('../models/Booking');
const Member = require('../models/Member');

const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      if (req.session.user == null || req.session.user == undefined) {
        res.render('index', {
          alert: {
            message: alertMessage,
            status: alertStatus,
          },
          title: 'Staycation | Sign In',
        });
      } else {
        res.redirect('/admin/dashboard');
      }
    } catch (error) {
      res.redirect('/admin/category');
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      if (!user) {
        req.flash('alertMessage', 'Username tidak ditemukan');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }
      const isMatchPass = await bcrypt.compare(password, user.password);
      if (!isMatchPass) {
        req.flash('alertMessage', 'Password yang anda masukkan salah!');
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/signin');
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      };
      res.redirect('/admin/dashboard');
    } catch (error) {
      res.redirect('/admin/signin');
    }
  },

  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect('/admin/signin');
  },

  viewDashboard: async (req, res) => {
    try {
      const item = await Item.find();
      const booking = await Booking.find();
      const member = await Member.find();
      res.render('admin/dashboard/view-dashboard', {
        title: 'Staycation | Dashboard',
        user: req.session.user,
        item,
        booking,
        member,
      });
    } catch (error) {
      res.redirect('/admin/dashboard');
    }
  },

  // Category
  viewCategory: async (req, res) => {
    try {
      const categorys = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      res.render('admin/category/view-category', {
        categorys,
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        title: 'Staycation | Category',
        user: req.session.user,
      });
    } catch (error) {
      res.redirect('/admin/category');
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.create({ name });
      req.flash('alertMessage', 'Succses Menambah Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      await Category.updateOne(
        { _id: id },
        {
          $set: {
            name: name,
          },
        }
      );
      req.flash('alertMessage', 'Succses Mengubah Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  hapusCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.deleteOne({ _id: id });
      req.flash('alertMessage', 'Succses Menghapus Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  // Bank
  viewBank: async (req, res) => {
    try {
      const banks = await Bank.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      res.render('admin/bank/view-bank', {
        title: 'Staycation | Bank',
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        banks,
        user: req.session.user,
      });
    } catch (error) {
      res.redirect('/admin/bank');
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, namaBank, nomorRekening } = req.body;
      await Bank.create({
        name: name,
        namaBank: namaBank,
        nomorRekening: nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash('alertMessage', 'Succses Menambahkan Category');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, namaBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      if (req.file == undefined) {
        bank.name = name;
        bank.namaBank = namaBank;
        bank.nomorRekening = nomorRekening;
        await bank.save();
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.namaBank = namaBank;
        bank.nomorRekening = nomorRekening;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
      }
      req.flash('alertMessage', 'Succses Mengubah Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  hapusBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });

      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await Bank.deleteOne({ _id: id });
      req.flash('alertMessage', 'Succses Menghapus Bank');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  // Item
  viewItem: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const items = await Item.find().populate({ path: 'imageId', select: 'id imageUrl' }).populate({ path: 'categoryId', select: 'id name' });
      const categorys = await Category.find();
      res.render('admin/item/view-item', {
        title: 'Staycation | Item',
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        categorys,
        items,
        action: 'view',
        user: req.session.user,
      });
    } catch (error) {
      res.redirect('/admin/item');
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, about } = req.body;
      if (req.files.length > 0) {
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description: about,
          price,
          city,
        };
        const item = await Item.create(newItem);
        category.itemId.push({ _id: item._id });
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
          item.imageId.push({ _id: imageSave._id });
          await item.save();
        }
        req.flash('alertMessage', 'Succses Menambahkan Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  viewImageItem: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const { id } = req.params;
      const items = await Item.findOne({ _id: id }).populate({ path: 'imageId', select: 'id imageUrl' });

      const categorys = await Category.find();
      res.render('admin/item/view-item', {
        title: 'Staycation | Show Image Item',
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        categorys,
        items,
        action: 'show image',
        user: req.session.user,
      });
    } catch (error) {
      res.redirect('/admin/item');
    }
  },

  viewEditItem: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');

      const { id } = req.params;
      const items = await Item.findOne({ _id: id }).populate({ path: 'imageId', select: 'id imageUrl' }).populate({ path: 'categoryId', select: 'id name' });
      const categorys = await Category.find();
      res.render('admin/item/view-item', {
        title: 'Staycation | Show Image Item',
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        categorys,
        items,
        action: 'edit',
      });
    } catch (error) {
      res.redirect('/admin/item');
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, about } = req.body;
      const item = await Item.findOne({ _id: id }).populate({ path: 'imageId', select: 'id imageUrl' }).populate({ path: 'categoryId', select: 'id name' });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash('alertMessage', 'Succses Mengubah Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash('alertMessage', 'Succses Mengubah Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId');
      item.imageId.forEach((imageId) => {
        Image.findOne({ _id: imageId._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
          });
      });
      await Item.deleteOne({ _id: id });
      req.flash('alertMessage', 'Succses Menghapus Item');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  viewDetailItem: async (req, res) => {
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const { itemId } = req.params;
      const features = await Feature.find({ itemId: itemId });
      const activities = await Activity.find({ itemId: itemId });
      res.render('admin/item/detailItem/view-detail-item', {
        title: 'Staycation | Show Detail Item',
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
        itemId,
        features,
        activities,
        user: req.session.user,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addFeature: async (req, res) => {
    try {
      const { nama, qty, itemId } = req.body;
      if (!req.file) {
        req.flash('alertMessage', `Gagal Menambahkan Feature`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const feature = await Feature.create({
        name: nama,
        qty: qty,
        imageUrl: `images/${req.file.filename}`,
        itemId: itemId,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      item.save();

      req.flash('alertMessage', 'Succses Menambahkan Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, nama, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = nama;
        feature.qty = qty;
        await feature.save();
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = nama;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();
      }
      req.flash('alertMessage', 'Succses Mengubah Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });
      const itemId = feature.itemId;
      const item = await Item.findOne({ _id: itemId }).populate('featureId');
      item.featureId.forEach(async (featureId) => {
        if (featureId._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      });

      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.deleteOne({ _id: id });
      req.flash('alertMessage', 'Succses Menghapus Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      const feature = await Feature.findOne({ _id: id });
      const itemId = feature.itemId;
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  addActivity: async (req, res) => {
    const { nama, type, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash('alertMessage', `Gagal Menambahkan Activity`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }

      const activity = await Activity.create({
        name: nama,
        type: type,
        imageUrl: `images/${req.file.filename}`,
        itemId: itemId,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      item.save();

      req.flash('alertMessage', 'Succses Menambahkan Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, nama, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = nama;
        activity.type = type;
        await activity.save();
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = nama;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();
      }
      req.flash('alertMessage', 'Succses Mengubah Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    try {
      const { id } = req.params;
      const activity = await Activity.findOne({ _id: id });
      const itemId = activity.itemId;
      const item = await Item.findOne({ _id: itemId }).populate('activityId');
      item.activityId.forEach(async (activityId) => {
        if (activityId._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      });

      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.deleteOne({ _id: id });
      req.flash('alertMessage', 'Succses Menghapus Activity');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      const activity = await activity.findOne({ _id: id });
      const itemId = activity.itemId;
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  // Booking
  viewBooking: async (req, res) => {
    try {
      const bookings = await Booking.find().populate('memberId').populate('bankId');
      res.render('admin/booking/view-booking', {
        title: 'Staycation | Booking',
        user: req.session.user,
        bookings,
      });
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },

  viewDetailBooking: async (req, res) => {
    try {
      const bookings = await Booking.findOne({ _id: req.params.id }).populate('memberId').populate('bankId');
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      res.render('admin/booking/show-detail-booking', {
        title: 'Staycation | Detail Booking',
        user: req.session.user,
        bookings,
        alert: {
          message: alertMessage,
          status: alertStatus,
        },
      });
    } catch (error) {
      res.redirect('/admin/booking');
    }
  },
  actionConfirmation: async (req, res) => {
    const id = req.params.id;
    try {
      const booking = await Booking.findOne({ _id: id }).populate('memberId').populate('bankId');
      booking.payments.status = 'Accept';
      await booking.save();
      req.flash('alertMessage', 'Succses Confirmasi Booking');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
  actionReject: async (req, res) => {
    const id = req.params.id;
    try {
      const booking = await Booking.findOne({ _id: id }).populate('memberId').populate('bankId');
      booking.payments.status = 'Reject';
      await booking.save();
      req.flash('alertMessage', 'Succses Reject Booking');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/booking/${id}`);
    } catch (error) {
      res.redirect(`/admin/booking/${id}`);
    }
  },
};
