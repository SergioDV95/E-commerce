import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { polar } from "./exportsImports";



const styles = StyleSheet.create({
   page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      fontSize: 25
   },
   section: {
      margin: 10,
      padding: 10,
      flexGrow: 0.5,
      flexDirection: 'row',
      justifyContent: 'space-between'
   },
   row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingVertical: 10,
      flexGrow: 1
   },
   item: {
      flex: 1,
      flexDirection: 'row',
   },
   caption: {
      fontSize: 25
   }
});


const PDFDocument = ({saleData, productData, renderTime, user}) => {
   const renderProducts = function(products, quantity) {
      let productsList = [];
      for(let doc of products) {
         for(let id in quantity) {
            if(doc._id === id) {
               productsList.push({name: doc.name, quantity: quantity[id], price: doc.price});
            }
         }
      }
      return productsList.map(({name, quantity, price}, index) => (
         <View key={index} style={styles.row}>
            <Text style={styles.item}>{name}</Text>
            <Text style={styles.item}>x{quantity}</Text>
            <Text style={styles.item}>${price.toFixed(2)}</Text>
         </View>
      ));
   }
   return (
      <Document>
         <Page size="A3" style={styles.page}>
            <View style={[styles.section, { justifyContent: 'center', alignItems: 'center'}]}>
               <Image src={polar} style={{ width: 350 }} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
               <Text style={{fontSize: 30, marginVertical: 20}}>Factura</Text>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>Referencia:</Text><Text>{saleData && saleData._id}</Text>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>Fecha:</Text><Text>{renderTime(saleData && saleData.createdAt)}</Text>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>Cliente:</Text><Text>{user && user.name + " " + user.lastName}</Text>
            </View>
            <View style={[styles.section, { flexGrow: productData && productData.length, flexDirection: 'column' }]}>
               <Text style={styles.caption}>Productos:</Text>
               <View style={{flex: 1, flexDirection: 'column', marginTop: 5, fontSize: 20}}>{productData && renderProducts(productData, saleData.quantity)}</View>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>Subtotal:</Text><Text>${saleData && saleData.subtotal && saleData.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>IVA 16%:</Text><Text>${saleData && saleData.tax && saleData.tax.toFixed(2)}</Text>
            </View>
            <View style={styles.section}>
               <Text style={styles.caption}>Total:</Text><Text>${saleData && saleData.total && saleData.total.toFixed(2)}</Text>
            </View>
         </Page>
      </Document>
   )
};

export default PDFDocument;
