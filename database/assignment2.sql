/* (1) Insert the following new record to the account table Note: The account_id and account_type fields should handle their own values and do not need to be part of this query.
 Tony, Stark, tony@starkent.com, Iam1ronM@n */
insert into account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
values (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
/* (2) modify the tony stark record to  change the account type to "Admin" */
update account
set account_type = 'Admin'
where account_firstname = 'Tony';
/* (3) Delete the Tony Stark record from the Database */
delete from account
where account_firstname = 'Tony';
/* (4) Modify GM Hummer from "small interiors"  to "a huge interior" */
update inventory
set inv_description = replace(
        inv_description,
        'small interior',
        'a huge interior'
    );
/* (5) inner join statement */
select distinct inv_make,
    inv_model,
    classification_name
from classification
    inner join inventory on classification.classification_id = inventory.classification_id
where classification_name = 'Sport';
/* (6) update inventory image file path */
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');